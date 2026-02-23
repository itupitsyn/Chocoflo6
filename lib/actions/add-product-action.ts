'use server';

import prisma from '@/prisma/prisma';

import { addProductInputSchema } from '../schemas/add-product-schema';
import { saveImagesToFiles } from '../utils';
import { authActionClient } from './safe-action';

export const addProductAction = authActionClient
  .inputSchema(addProductInputSchema)
  .action(async ({ parsedInput: { description, name, images } }) => {
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
        images: fileNames,
      },
    });

    return data;
  });
