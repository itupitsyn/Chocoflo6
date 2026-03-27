'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { editOptionInputSchema } from '../schemas/edit-option-schema';
import { normalizePrice, updateFiles } from '../utils';
import { adminActionClient } from './safe-action';

export const editOptionAction = adminActionClient
  .inputSchema(editOptionInputSchema)
  .action(async ({ parsedInput: { name, price, id, images } }) => {
    const oldItem = await prisma.option.findFirst({
      where: {
        id,
      },
    });

    const fileNames = await updateFiles(images, oldItem?.images);

    const data = await prisma.option.update({
      where: {
        id,
      },
      data: {
        name,
        price,
        images: fileNames,
      },
    });

    revalidatePath('/', 'layout');
    return normalizePrice(data);
  });
