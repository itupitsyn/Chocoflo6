'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { deleteOptionInputSchema } from '../schemas/delete-option-schema';
import { deleteFiles } from '../utils';
import { adminActionClient } from './safe-action';

export const deleteOptionAction = adminActionClient
  .inputSchema(deleteOptionInputSchema)
  .action(async ({ parsedInput: { id } }) => {
    const data = await prisma.option.findFirst({
      where: {
        id,
      },
    });

    await prisma.option.update({
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
