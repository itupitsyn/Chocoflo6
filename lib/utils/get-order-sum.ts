'use server';

import { Option, Product, Variant } from '../generated/prisma/client';
import { Decimal } from '../generated/prisma/internal/prismaNamespace';

type OrderData = {
  orderItems: {
    product: Product;
    variant: Variant;
    count: number;
    orderItemOptions: {
      option: Option;
    }[];
  }[];
};

export const getOrderSum = async (order: OrderData): Promise<Decimal> => {
  let price: Decimal = new Decimal(0);

  order.orderItems.forEach((item) => {
    let itemPrice = item.variant.price;

    item.orderItemOptions.forEach((opt) => {
      itemPrice = itemPrice.add(opt.option.price);
    });

    itemPrice.mul(item.count);
    price = price.add(itemPrice);
  });

  return price;
};
