import prisma from '@/prisma/prisma';

import { Option, OrderStatus, Product, Variant } from '../generated/prisma/client';
import { Decimal } from '../generated/prisma/internal/prismaNamespace';
import { getOrderSum } from '../utils/get-order-sum';

type OrderItem = {
  id: string;
  product: Product;
  variant: Variant;
  count: number;
  opts: Option[];
};

export type OrderWithItems = {
  id: number;
  status: OrderStatus;
  items: OrderItem[];
  price: Decimal;
};

export const getCurrentOrder = async (userId: bigint | undefined): Promise<OrderWithItems | null> => {
  if (!userId) {
    return null;
  }

  const order = await prisma.order.findFirst({
    where: {
      status: 'CART',
      userId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
          variant: true,
          orderItemOptions: {
            include: {
              option: true,
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  const items = order?.orderItems.reduce<OrderItem[]>((prev, curr) => {
    prev.push({
      id: curr.id,
      product: curr.product,
      variant: curr.variant,
      count: curr.count,
      opts: curr.orderItemOptions.map((item) => item.option),
    });

    return prev;
  }, []);

  const price = await getOrderSum(order);

  return { id: order.id, status: order.status, items, price };
};
