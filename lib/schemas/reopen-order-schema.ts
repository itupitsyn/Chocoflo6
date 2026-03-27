import z from 'zod';

export const reopenOrderSchema = z.object({
  id: z.number(),
});
