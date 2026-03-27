'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { finishOrderSchema } from '../schemas/finish-order-schema';
import { adminActionClient } from './safe-action';

export const finishOrderAction = adminActionClient
  .inputSchema(finishOrderSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: 'COMPLETED',
      },
    });

    revalidatePath('/', 'layout');
  });
