import { OrderStatus } from './OrderStatus';

export interface OrderFilterState {
  statuses: OrderStatus[];
  customerName: string;
  productId: string | null;
  categoryId: string | null;
}

export const DEFAULT_FILTER_STATE: OrderFilterState = {
  statuses: [OrderStatus.NEW, OrderStatus.CONFIRMED],
  customerName: '',
  productId: null,
  categoryId: null,
};

export function createDefaultFilterState(): OrderFilterState {
  return { ...DEFAULT_FILTER_STATE };
}

export function isDefaultFilterState(state: OrderFilterState): boolean {
  return (
    state.statuses.length === DEFAULT_FILTER_STATE.statuses.length &&
    state.statuses.every((s) => DEFAULT_FILTER_STATE.statuses.includes(s)) &&
    state.customerName === DEFAULT_FILTER_STATE.customerName &&
    state.productId === DEFAULT_FILTER_STATE.productId &&
    state.categoryId === DEFAULT_FILTER_STATE.categoryId
  );
}
