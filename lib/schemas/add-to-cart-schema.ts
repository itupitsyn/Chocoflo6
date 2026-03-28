import z from 'zod';

import { optionSchema } from './option-schema';
import { variantSchema } from './variant-schema';

export const addToCartSchema = z.object({
  productId: z.string(),
  variant: variantSchema,
  options: optionSchema.array().optional(),
  count: z.number(),
});
