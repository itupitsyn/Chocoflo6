'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { editCartItemSchema } from '../schemas/edit-cart-item-schema';
import { authActionClient } from './safe-action';

export const editCartItemAction = authActionClient
  .inputSchema(editCartItemSchema)
  .action(async ({ parsedInput: { count, id }, ctx: { user } }) => {
    if (!user) {
      throw new Error('unknown user');
    }

    await prisma.$transaction(async (tx) => {
      const orderItem = await tx.orderItem.findFirst({
        where: {
          id,
        },
        include: {
          order: true,
        },
      });

      if (!orderItem) {
        throw new Error('No such cart');
      }
      if (orderItem.order.status !== 'CART') {
        throw new Error(`Wrong order status. Expected CART. Current status is ${orderItem.order.status}`);
      }
      if (orderItem.order.userId != user.id) {
        throw new Error('Forbidden');
      }

      const newCount = orderItem.count + count;
      if (newCount <= 0) {
        await tx.orderItem.delete({ where: { id } });
      } else {
        await tx.orderItem.update({ where: { id }, data: { count: newCount } });
      }
    });

    revalidatePath('/', 'layout');
  });
