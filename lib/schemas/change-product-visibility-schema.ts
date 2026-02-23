import z from 'zod';

export const changeProductVisibilityInputSchema = z.object({
  id: z.string(),
  isHidden: z.boolean(),
});
