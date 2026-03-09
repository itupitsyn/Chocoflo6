import z from 'zod';

export const deleteOptionInputSchema = z.object({
  id: z.string(),
});
