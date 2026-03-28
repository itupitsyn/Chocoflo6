import z from 'zod';

export const editCartItemSchema = z.object({
  count: z.number(),
  id: z.string(),
});
