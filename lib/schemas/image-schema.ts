import z from 'zod';

import { IMG_FORMATS, MAX_IMG_SIZE } from '../constants/images';
import { imageFileSchema } from './image-file-schema';

export const itemAddImageSchema = z.object({
  id: z.number(),
  src: z.string(),
  file: imageFileSchema
    .refine((file) => file?.size <= MAX_IMG_SIZE, `Максимальный размер картинки ${MAX_IMG_SIZE / 1024 / 1024}МБ`)
    .refine((file) => IMG_FORMATS.includes(file?.type), 'Только форматы .jpg, .jpeg, .png и .webp'),
});

export const itemAddImageArraySchema = itemAddImageSchema.array().optional();

export const itemEditImageSchema = z.union([
  z.object({
    id: z.number(),
    src: z.string(),
    file: imageFileSchema
      .refine((file) => file?.size <= MAX_IMG_SIZE, `Максимальный размер картинки ${MAX_IMG_SIZE / 1024 / 1024}МБ`)
      .refine((file) => IMG_FORMATS.includes(file?.type), 'Только форматы .jpg, .jpeg, .png и .webp'),
    uploaded: z.literal(false),
  }),
  z.object({
    id: z.number(),
    src: z.string(),
    uploaded: z.literal(true),
  }),
]);

export const itemEditImageArraySchema = itemEditImageSchema.array().optional();
