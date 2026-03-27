'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { reopenOrderSchema } from '../schemas/reopen-order-schema';
import { adminActionClient } from './safe-action';

export const reopenOrderAction = adminActionClient
  .inputSchema(reopenOrderSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: 'PROCESSING',
      },
    });

    revalidatePath('/', 'layout');
  });
