'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { editProductInputSchema } from '../schemas/edit-product-schema';
import { normalizePrice, updateFiles } from '../utils';
import { adminActionClient } from './safe-action';

export const editProductAction = adminActionClient
  .inputSchema(editProductInputSchema)
  .action(async ({ parsedInput: { description, name, images, id, code, options, variants } }) => {
    const data = await prisma.$transaction(async (tx) => {
      const oldItem = await prisma.product.findFirst({
        where: {
          id,
        },
        include: {
          variants: true,
        },
      });

      const fileNames = await updateFiles(images, oldItem?.images);
      await tx.productOption.deleteMany({
        where: {
          productId: id,
        },
      });

      const variantsToDelete = oldItem?.variants.filter((item) => {
        return !variants.some((subitem) => subitem.id === item.id);
      });

      if (variantsToDelete?.length) {
        await tx.variant.updateMany({
          where: {
            id: {
              in: variantsToDelete.map((item) => item.id),
            },
          },
          data: {
            deletedAt: new Date(),
          },
        });
      }

      const variantsToUpdate = variants.filter((item) => item.id);

      await Promise.all(
        variantsToUpdate.map((item) =>
          tx.variant.update({
            where: {
              id: item.id,
            },
            data: {
              name: item.name,
              price: item.price,
            },
          }),
        ),
      );

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
          variants: {
            where: {
              deletedAt: null,
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
          variants: {
            create: variants?.filter((item) => !item.id),
          },
          images: fileNames,
        },
      });
    });

    revalidatePath('/', 'layout');
    return { ...data, variants: data.variants.map(normalizePrice) };
  });
