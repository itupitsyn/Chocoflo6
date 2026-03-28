'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { addToCartSchema } from '../schemas/add-to-cart-schema';
import { authActionClient } from './safe-action';

export const addToCartAction = authActionClient
  .inputSchema(addToCartSchema)
  .action(async ({ parsedInput: { count, productId, options, variant }, ctx: { user } }) => {
    if (!user) {
      throw new Error('unknown user');
    }

    await prisma.$transaction(async (tx) => {
      let dbUser = await tx.user.findFirst({
        where: {
          id: user.id,
        },
      });

      if (dbUser === null) {
        const nameParts: string[] = [];
        if (user.first_name) {
          nameParts.push(user.first_name);
        }
        if (user.last_name) {
          nameParts.push(user.last_name);
        }

        dbUser = await tx.user.create({
          data: {
            id: user.id,
            name: nameParts.join(' '),
            userName: user.username || '',
          },
        });
      }

      let order = await tx.order.findFirst({
        where: { status: 'CART', userId: user.id },
        include: { orderItems: { include: { orderItemOptions: true } } },
      });

      if (!order) {
        order = await tx.order.create({
          data: { status: 'CART', userId: user.id },
          include: { orderItems: { include: { orderItemOptions: true } } },
        });
      }

      const sortedOpts = options ? [...options.map((item) => item.id)] : [];

      sortedOpts.sort();

      const foundItem = order.orderItems.find((item) => {
        const opts = item.orderItemOptions.map((opt) => opt.optionId);
        opts.sort();
        return item.productId === productId && item.variantId === variant.id && opts.join() === sortedOpts.join();
      });

      if (foundItem) {
        const newCount = foundItem.count + count;
        if (newCount === 0) {
          await tx.orderItem.delete({
            where: {
              id: foundItem.id,
            },
          });
        } else {
          await tx.orderItem.update({
            where: {
              id: foundItem.id,
            },
            data: {
              count: foundItem.count + count,
            },
          });
        }
      } else {
        await tx.orderItem.create({
          data: {
            productId,
            variantId: variant.id,
            orderId: order.id,
            count,
            orderItemOptions: {
              createMany: {
                data: options?.map((item) => ({ optionId: item.id })) ?? [],
              },
            },
          },
        });
      }
    });

    revalidatePath('/', 'layout');
  });
