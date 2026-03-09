import z from 'zod';

import { itemAddImageArraySchema } from './image-schema';

export const addOptionInputSchema = z.object({
  name: z.string().max(128, { message: 'Максимальная длина 128' }).min(1, { message: 'Обязательное поле' }),
  price: z.coerce.number<number>().min(0.01, { message: 'Обязательное поле' }),
  images: itemAddImageArraySchema,
});
