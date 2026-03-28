'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma';

import { changeProductVisibilityInputSchema } from '../schemas/change-product-visibility-schema';
import { adminActionClient } from './safe-action';

export const changeProductVisibilityAction = adminActionClient
  .inputSchema(changeProductVisibilityInputSchema)
  .action(async ({ parsedInput: { id, isHidden } }) => {
    const data = await prisma.product.update({
      where: {
        id,
      },
      data: {
        isPublished: !isHidden,
      },
    });

    revalidatePath('/', 'layout');
    return data;
  });
