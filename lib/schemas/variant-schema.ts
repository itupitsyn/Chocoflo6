import z from 'zod';

export const variantSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const addVariantSchema = z.object({
  name: z.string().min(1, { error: 'Обязательное поле' }),
  price: z.coerce.number<number>().positive({ error: 'Цена должна быть больше 0' }),
});

export const editVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { error: 'Обязательное поле' }),
  price: z.coerce.number<number>().positive({ error: 'Цена должна быть больше 0' }),
});
