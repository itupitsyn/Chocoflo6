'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { cancelOrderSchema } from '../schemas/cancel-order-schema';
import { adminActionClient } from './safe-action';

export const cancelOrderAction = adminActionClient
  .inputSchema(cancelOrderSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
      },
    });

    revalidatePath('/', 'layout');
  });
