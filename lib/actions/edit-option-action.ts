'use server';

import prisma from '@/prisma/prisma';

import { editOptionInputSchema } from '../schemas/edit-option-schema';
import { normalizeOption, updateFiles } from '../utils';
import { authActionClient } from './safe-action';

export const editOptionAction = authActionClient
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

    return normalizeOption(data);
  });
