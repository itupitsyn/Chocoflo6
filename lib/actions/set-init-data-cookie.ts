'use server';

import { cookies } from 'next/headers';
import { returnValidationErrors } from 'next-safe-action';
import z from 'zod';

import { actionClient } from './safe-action';

const inputSchema = z.object({
  initData: z.string(),
});

export const setInitTgCookie = actionClient.inputSchema(inputSchema).action(async ({ parsedInput: { initData } }) => {
  try {
    (await cookies()).set('tg-init-data', initData, {
      httpOnly: true,
      maxAge: 86400,
      sameSite: 'lax',
      secure: true,
    });
  } catch (error) {
    console.error(error);

    return returnValidationErrors(inputSchema, {
      _errors: [error instanceof Error ? error.message : String(error)],
    });
  }
});
