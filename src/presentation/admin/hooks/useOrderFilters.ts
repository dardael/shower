'use client';

import { useState, useCallback, useMemo } from 'react';
import { Order } from '@/domain/order/entities/Order';
import { OrderStatus } from '@/domain/order/value-objects/OrderStatus';
import {
  OrderFilterState,
  DEFAULT_FILTER_STATE,
} from '@/domain/order/value-objects/OrderFilterState';
import { normalizeText } from '@/domain/shared/utils/textNormalization';

interface UseOrderFiltersReturn {
  filterState: OrderFilterState;
  setStatusFilter: (statuses: OrderStatus[]) => void;
  setCustomerNameFilter: (name: string) => void;
  setProductFilter: (productId: string | null) => void;
  setCategoryFilter: (categoryId: string | null) => void;
  resetFilters: () => void;
  applyFilters: (
    orders: Order[],
    productCategoryMap?: Map<string, string[]>
  ) => Order[];
}

export function useOrderFilters(): UseOrderFiltersReturn {
  const [filterState, setFilterState] =
    useState<OrderFilterState>(DEFAULT_FILTER_STATE);

  const setStatusFilter = useCallback((statuses: OrderStatus[]): void => {
    setFilterState((prev) => ({ ...prev, statuses }));
  }, []);

  const setCustomerNameFilter = useCallback((customerName: string): void => {
    setFilterState((prev) => ({ ...prev, customerName }));
  }, []);

  const setProductFilter = useCallback((productId: string | null): void => {
    setFilterState((prev) => ({ ...prev, productId }));
  }, []);

  const setCategoryFilter = useCallback((categoryId: string | null): void => {
    setFilterState((prev) => ({ ...prev, categoryId }));
  }, []);

  const resetFilters = useCallback((): void => {
    setFilterState(DEFAULT_FILTER_STATE);
  }, []);

  const applyFilters = useCallback(
    (orders: Order[], productCategoryMap?: Map<string, string[]>): Order[] => {
      return orders.filter((order) => {
        // Status filter
        if (
          filterState.statuses.length > 0 &&
          !filterState.statuses.includes(order.status)
        ) {
          return false;
        }

        // Customer name filter (case and accent insensitive)
        if (filterState.customerName.trim()) {
          const searchTerm = normalizeText(filterState.customerName);
          const fullName = normalizeText(
            `${order.customerFirstName} ${order.customerLastName}`
          );
          if (!fullName.includes(searchTerm)) {
            return false;
          }
        }

        // Product filter
        if (filterState.productId) {
          const hasProduct = order.items.some(
            (item) => item.productId === filterState.productId
          );
          if (!hasProduct) {
            return false;
          }
        }

        // Category filter (requires productCategoryMap)
        if (filterState.categoryId && productCategoryMap) {
          const hasCategory = order.items.some((item) => {
            const categoryIds = productCategoryMap.get(item.productId);
            return categoryIds?.includes(filterState.categoryId as string);
          });
          if (!hasCategory) {
            return false;
          }
        }

        return true;
      });
    },
    [filterState]
  );

  return useMemo(
    () => ({
      filterState,
      setStatusFilter,
      setCustomerNameFilter,
      setProductFilter,
      setCategoryFilter,
      resetFilters,
      applyFilters,
    }),
    [
      filterState,
      setStatusFilter,
      setCustomerNameFilter,
      setProductFilter,
      setCategoryFilter,
      resetFilters,
      applyFilters,
    ]
  );
}
