'use server';

import prisma from '@/prisma/prisma';

import { editProductInputSchema } from '../schemas/edit-product-schema';
import { updateFiles } from '../utils';
import { authActionClient } from './safe-action';

export const editProductAction = authActionClient
  .inputSchema(editProductInputSchema)
  .action(async ({ parsedInput: { description, name, images, id, code } }) => {
    const oldItem = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    const fileNames = await updateFiles(images, oldItem?.images);

    const data = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        code,
        images: fileNames,
      },
    });

    return data;
  });
