'use server';

import prisma from '@/prisma/prisma';

import { changeProductVisibilityInputSchema } from '../schemas/change-product-visibility-schema';
import { authActionClient } from './safe-action';

export const changeProductVisibilityAction = authActionClient
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

    return data;
  });
