'use server';

import prisma from '@/prisma/prisma';

import { editProductInputSchema } from '../schemas/edit-product-schema';
import { updateFiles } from '../utils';
import { authActionClient } from './safe-action';

export const editProductAction = authActionClient
  .inputSchema(editProductInputSchema)
  .action(async ({ parsedInput: { description, name, images, id, code, options } }) => {
    const oldItem = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    const fileNames = await updateFiles(images, oldItem?.images);

    const data = await prisma.$transaction(async (tx) => {
      await tx.productOption.deleteMany({
        where: {
          productId: id,
        },
      });

      return tx.product.update({
        include: {
          productOptions: {
            where: {
              option: {
                deletedAt: null,
              },
            },
            select: {
              option: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        where: {
          id,
        },
        data: {
          name,
          description,
          code,
          productOptions: {
            create: options?.map((item) => ({ optionId: item.id })),
          },
          images: fileNames,
        },
      });
    });

    return data;
  });
