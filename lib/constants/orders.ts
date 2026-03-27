import { OrderStatus } from '../generated/prisma/enums';

export const statusLabels: Record<OrderStatus, string> = {
  CANCELLED: 'Отменен',
  CART: 'Корзина',
  COMPLETED: 'Завершен',
  PENDING: 'Ожидает',
  PROCESSING: 'В работе',
  SHIPPING: 'Доставляется',
};
