'use server';

import prisma from '@/prisma/prisma';

import { deleteOptionInputSchema } from '../schemas/delete-option-schema';
import { deleteFiles } from '../utils';
import { authActionClient } from './safe-action';

export const deleteOptionAction = authActionClient
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

    if (data) {
      deleteFiles(data.images);
    }
  });
