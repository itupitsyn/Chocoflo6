import z from 'zod';

export const deleteProductInputSchema = z.object({
  id: z.string(),
});
