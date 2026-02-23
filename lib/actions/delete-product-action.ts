'use server';

import prisma from '@/prisma/prisma';

import { deleteProductInputSchema } from '../schemas/delete-product-schema';
import { deleteFiles } from '../utils/delete-files';
import { authActionClient } from './safe-action';

export const deleteProductAction = authActionClient
  .inputSchema(deleteProductInputSchema)
  .action(async ({ parsedInput: { id } }) => {
    const data = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (data) {
      deleteFiles(data.images);
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });
  });
