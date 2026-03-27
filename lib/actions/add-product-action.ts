'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { addProductInputSchema } from '../schemas/add-product-schema';
import { saveImagesToFiles } from '../utils';
import { adminActionClient } from './safe-action';

export const addProductAction = adminActionClient
  .inputSchema(addProductInputSchema)
  .action(async ({ parsedInput: { description, name, images, options, code, variants } }) => {
    const fileNames: string[] = [];
    if (images?.length) {
      const result = await saveImagesToFiles(images?.map((item) => item.file));
      result?.forEach((item) => {
        if (item.status === 'fulfilled' && item.value) {
          fileNames.push(item.value);
        }
      });
    }

    const data = await prisma.product.create({
      data: {
        name,
        description,
        code,
        productOptions: {
          create: options?.map((item) => ({ optionId: item.id })),
        },
        variants: {
          create: variants,
        },
        images: fileNames,
      },
    });

    revalidatePath('/', 'layout');
    return data;
  });
