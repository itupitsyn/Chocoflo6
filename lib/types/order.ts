import { Option, Product, Variant } from '../generated/prisma/client';

export type OrderItemData = {
  product: Product;
  variant: Variant;
  count: number;
  orderItemOptions: {
    option: Option;
  }[];
};

export type OrderData = {
  id: number;
  orderItems: OrderItemData[];
};
