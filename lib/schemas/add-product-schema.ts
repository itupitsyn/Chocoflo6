import z from 'zod';

import { itemAddImageArraySchema } from './image-schema';
import { optionSchema } from './option-schema';

export const addProductInputSchema = z.object({
  name: z.string().max(128, { message: 'Максимальная длина 128' }).min(1, { message: 'Обязательное поле' }),
  description: z.string().max(1024, { message: 'Максимальная длина 1024' }).min(1, { message: 'Обязательное поле' }),
  code: z.string().max(128, { message: 'Максимальная длина 128' }).nullable(),
  images: itemAddImageArraySchema,
  options: optionSchema.array().optional(),
});
