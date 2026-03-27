'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { addOptionInputSchema } from '../schemas/add-option-schema';
import { saveImagesToFiles } from '../utils';
import { adminActionClient } from './safe-action';

export const addOptionAction = adminActionClient
  .inputSchema(addOptionInputSchema)
  .action(async ({ parsedInput: { name, price, images } }) => {
    const fileNames: string[] = [];
    if (images?.length) {
      const result = await saveImagesToFiles(images?.map((item) => item.file));
      result?.forEach((item) => {
        if (item.status === 'fulfilled' && item.value) {
          fileNames.push(item.value);
        }
      });
    }

    const data = await prisma.option.create({
      data: {
        name,
        price,
        images: fileNames,
      },
    });

    revalidatePath('/', 'layout');
    return { ...data, price: data.price.toNumber() };
  });
