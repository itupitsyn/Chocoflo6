'use server';

import { redirect } from 'next/navigation';

import prisma from '@/prisma/prisma';

import { submitOrderSchema } from '../schemas/submit-order-schema';
import { notifyAdmin } from '../utils';
import { authActionClient } from './safe-action';

export const submitOrderAction = authActionClient
  .inputSchema(submitOrderSchema)
  .action(async ({ parsedInput: { orderId }, ctx: { user } }) => {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: {
          id: orderId,
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
          },
        },
      });

      if (!order || order.status !== 'CART' || order.userId != user.id) {
        throw new Error('Wrong order');
      }

      await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: 'PROCESSING',
        },
      });

      notifyAdmin(order, user);
    });

    redirect('/orders');
  });
