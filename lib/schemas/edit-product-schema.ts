import z from 'zod';

import { itemEditImageArraySchema } from './image-schema';
import { optionSchema } from './option-schema';
import { editVariantSchema } from './variant-schema';

export const editProductInputSchema = z.object({
  id: z.string(),
  name: z.string().max(128, { error: 'Максимальная длина 128' }).min(1, { error: 'Обязательное поле' }),
  code: z.string({ error: 'Обязательное поле' }).max(128, { message: 'Максимальная длина 128' }).nullable(),
  description: z.string().max(1024, { error: 'Максимальная длина 1024' }).min(1, { error: 'Обязательное поле' }),
  images: itemEditImageArraySchema,
  options: optionSchema.array().optional(),
  variants: editVariantSchema.array().min(1),
});
