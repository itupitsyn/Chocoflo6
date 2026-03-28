import z from 'zod';

export const cancelOrderSchema = z.object({
  id: z.number(),
});
