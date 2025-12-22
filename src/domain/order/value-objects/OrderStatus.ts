export enum OrderStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.NEW]: 'Nouveau',
  [OrderStatus.CONFIRMED]: 'Confirmée',
  [OrderStatus.COMPLETED]: 'Terminée',
};

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.NEW]: [OrderStatus.CONFIRMED, OrderStatus.COMPLETED],
  [OrderStatus.CONFIRMED]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [],
};

export function isValidOrderStatus(value: string): value is OrderStatus {
  return Object.values(OrderStatus).includes(value as OrderStatus);
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status];
}

export function getValidTransitions(status: OrderStatus): OrderStatus[] {
  return VALID_TRANSITIONS[status];
}

export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

export const OrderStatusUtils = {
  getValidTransitions,
  toFrenchLabel: getOrderStatusLabel,
  isValidTransition,
};
