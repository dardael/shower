'use client';

import { useMemo, useCallback } from 'react';
import { Order } from '@/domain/order/entities/Order';
import { OrderStatus } from '@/domain/order/value-objects/OrderStatus';
import { OrderFilterState } from '@/domain/order/value-objects/OrderFilterState';
import {
  OrderSortState,
  SortField,
} from '@/domain/order/value-objects/OrderSortState';
import { useOrderFilters } from './useOrderFilters';
import { useOrderSort } from './useOrderSort';

interface UseOrdersFilterSortReturn {
  // Filter state and setters
  filterState: OrderFilterState;
  setStatusFilter: (statuses: OrderStatus[]) => void;
  setCustomerNameFilter: (name: string) => void;
  setProductFilter: (productId: string | null) => void;
  setCategoryFilter: (categoryId: string | null) => void;

  // Sort state and setters
  sortState: OrderSortState;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;

  // Combined actions
  resetAll: () => void;
  getFilteredAndSortedOrders: (
    orders: Order[],
    productCategoryMap?: Map<string, string[]>
  ) => Order[];
}

export function useOrdersFilterSort(): UseOrdersFilterSortReturn {
  const {
    filterState,
    setStatusFilter,
    setCustomerNameFilter,
    setProductFilter,
    setCategoryFilter,
    resetFilters,
    applyFilters,
  } = useOrderFilters();

  const { sortState, setSortField, toggleSortDirection, resetSort, applySort } =
    useOrderSort();

  const resetAll = useCallback((): void => {
    resetFilters();
    resetSort();
  }, [resetFilters, resetSort]);

  const getFilteredAndSortedOrders = useCallback(
    (orders: Order[], productCategoryMap?: Map<string, string[]>): Order[] => {
      const filtered = applyFilters(orders, productCategoryMap);
      return applySort(filtered);
    },
    [applyFilters, applySort]
  );

  return useMemo(
    () => ({
      filterState,
      setStatusFilter,
      setCustomerNameFilter,
      setProductFilter,
      setCategoryFilter,
      sortState,
      setSortField,
      toggleSortDirection,
      resetAll,
      getFilteredAndSortedOrders,
    }),
    [
      filterState,
      setStatusFilter,
      setCustomerNameFilter,
      setProductFilter,
      setCategoryFilter,
      sortState,
      setSortField,
      toggleSortDirection,
      resetAll,
      getFilteredAndSortedOrders,
    ]
  );
}
