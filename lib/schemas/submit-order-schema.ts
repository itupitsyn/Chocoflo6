import z from 'zod';

export const submitOrderSchema = z.object({
  orderId: z.number(),
});
