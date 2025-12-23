import { OrderStatus } from './OrderStatus';

export type SortField = 'date' | 'customerName' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface OrderSortState {
  field: SortField;
  direction: SortDirection;
}

export const DEFAULT_SORT_STATE: OrderSortState = {
  field: 'date',
  direction: 'desc',
};

export const STATUS_SORT_ORDER: Record<OrderStatus, number> = {
  [OrderStatus.NEW]: 1,
  [OrderStatus.CONFIRMED]: 2,
  [OrderStatus.COMPLETED]: 3,
};

export function createDefaultSortState(): OrderSortState {
  return { ...DEFAULT_SORT_STATE };
}

export function toggleSortDirection(direction: SortDirection): SortDirection {
  return direction === 'asc' ? 'desc' : 'asc';
}

export function getNextSortState(
  currentState: OrderSortState,
  clickedField: SortField
): OrderSortState {
  if (currentState.field === clickedField) {
    return {
      field: clickedField,
      direction: toggleSortDirection(currentState.direction),
    };
  }
  return {
    field: clickedField,
    direction: 'desc',
  };
}
