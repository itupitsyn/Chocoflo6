'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { deleteProductInputSchema } from '../schemas/delete-product-schema';
import { deleteFiles } from '../utils';
import { adminActionClient } from './safe-action';

export const deleteProductAction = adminActionClient
  .inputSchema(deleteProductInputSchema)
  .action(async ({ parsedInput: { id } }) => {
    const data = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        images: [],
      },
    });

    revalidatePath('/', 'layout');
    if (data) {
      deleteFiles(data.images);
    }
  });
