import z from 'zod';

import { IMG_FORMATS, MAX_IMG_SIZE } from '../constants/images';

export const addProductInputSchema = z.object({
  name: z.string().max(128, { error: 'Максимальная длина 128' }).min(1, { error: 'Обязательное поле' }),
  description: z.string().max(1024, { error: 'Максимальная длина 1024' }).min(1, { error: 'Обязательное поле' }),
  images: z
    .object({
      id: z.number(),
      src: z.string(),
      file: z
        .any()
        .refine((file) => file?.size <= MAX_IMG_SIZE, `Максимальный размер картинки ${MAX_IMG_SIZE / 1024 / 1024}МБ`)
        .refine((file) => IMG_FORMATS.includes(file?.type), 'Только форматы .jpg, .jpeg, .png и .webp'),
    })
    .array()
    .optional(),
});
