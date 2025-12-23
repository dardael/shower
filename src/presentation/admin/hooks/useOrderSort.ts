'use client';

import { useState, useCallback, useMemo } from 'react';
import { Order } from '@/domain/order/entities/Order';
import { OrderStatus } from '@/domain/order/value-objects/OrderStatus';
import {
  OrderSortState,
  SortField,
  SortDirection,
  DEFAULT_SORT_STATE,
  STATUS_SORT_ORDER,
} from '@/domain/order/value-objects/OrderSortState';

interface UseOrderSortReturn {
  sortState: OrderSortState;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;
  resetSort: () => void;
  applySort: (orders: Order[]) => Order[];
}

export function useOrderSort(): UseOrderSortReturn {
  const [sortState, setSortState] =
    useState<OrderSortState>(DEFAULT_SORT_STATE);

  const setSortField = useCallback((field: SortField): void => {
    setSortState((prev) => {
      if (prev.field === field) {
        // Toggle direction if same field
        const newDirection: SortDirection =
          prev.direction === 'asc' ? 'desc' : 'asc';
        return { ...prev, direction: newDirection };
      }
      // New field: reset to descending
      return { field, direction: 'desc' };
    });
  }, []);

  const toggleSortDirection = useCallback((): void => {
    setSortState((prev) => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const resetSort = useCallback((): void => {
    setSortState(DEFAULT_SORT_STATE);
  }, []);

  const applySort = useCallback(
    (orders: Order[]): Order[] => {
      const sortedOrders = [...orders];

      sortedOrders.sort((a, b) => {
        let comparison = 0;

        switch (sortState.field) {
          case 'date': {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            comparison = dateA - dateB;
            break;
          }

          case 'customerName': {
            const nameA =
              `${a.customerFirstName} ${a.customerLastName}`.toLowerCase();
            const nameB =
              `${b.customerFirstName} ${b.customerLastName}`.toLowerCase();
            comparison = nameA.localeCompare(nameB, 'fr');
            break;
          }

          case 'status':
            comparison =
              STATUS_SORT_ORDER[a.status as OrderStatus] -
              STATUS_SORT_ORDER[b.status as OrderStatus];
            break;
        }

        return sortState.direction === 'asc' ? comparison : -comparison;
      });

      return sortedOrders;
    },
    [sortState]
  );

  return useMemo(
    () => ({
      sortState,
      setSortField,
      toggleSortDirection,
      resetSort,
      applySort,
    }),
    [sortState, setSortField, toggleSortDirection, resetSort, applySort]
  );
}
