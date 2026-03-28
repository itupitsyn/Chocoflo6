'use server';

import { Decimal } from '../generated/prisma/internal/prismaNamespace';
import { OrderData, OrderItemData } from '../types/order';

export const getOrderSum = async (order: OrderData): Promise<Decimal> => {
  let price: Decimal = new Decimal(0);

  await order.orderItems.forEach(async (item) => {
    const itemPrice = await getOrderItemSum(item);
    price = price.add(itemPrice);
  });

  return price;
};

export const getOrderItemSum = async (item: OrderItemData): Promise<Decimal> => {
  let itemPrice = item.variant.price;

  item.orderItemOptions.forEach((opt) => {
    itemPrice = itemPrice.add(opt.option.price);
  });

  return itemPrice.mul(item.count);
};
