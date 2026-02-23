'use server';

import prisma from '@/prisma/prisma';

import { editProductInputSchema } from '../schemas/edit-product-schema';
import { saveImagesToFiles } from '../utils';
import { deleteFiles } from '../utils/delete-files';
import { authActionClient } from './safe-action';

export const editProductAction = authActionClient
  .inputSchema(editProductInputSchema)
  .action(async ({ parsedInput: { description, name, images, id } }) => {
    const fileNames: string[] = [];
    const newFiles = images?.filter((item) => 'file' in item) ?? [];

    const result = await saveImagesToFiles(newFiles.map((item) => item.file));
    result?.forEach((item) => {
      if (item.status === 'fulfilled' && item.value) {
        fileNames.push(item.value);
      }
    });

    const oldItem = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    console.log(oldItem?.images);

    if (oldItem) {
      const oldFiles = images?.filter((item) => item.uploaded).map((item) => item.src) ?? [];
      const filesToDelete: string[] = [];

      oldItem.images.forEach((item) => {
        if (!oldFiles.find((fn) => fn === item)) {
          filesToDelete.push(item);
        } else {
          fileNames.push(item);
        }
      });

      deleteFiles(filesToDelete);
    }

    const data = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        images: fileNames,
      },
    });

    return data;
  });
