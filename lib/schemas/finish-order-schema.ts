import z from 'zod';

export const finishOrderSchema = z.object({
  id: z.number(),
});
