import z from 'zod';

export const optionSchema = z.object({
  id: z.string(),
  name: z.string(),
});
