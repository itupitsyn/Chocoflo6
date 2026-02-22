'use server';

import { returnValidationErrors } from 'next-safe-action';
import z from 'zod';

import { verifyTelegramAuth } from '@/lib/utils/telegram-auth';

import { actionClient } from './safe-action';

const inputSchema = z.object({
  initData: z.string(),
});

export const tgAuthAction = actionClient.inputSchema(inputSchema).action(async ({ parsedInput: { initData } }) => {
  try {
    const isOk = await verifyTelegramAuth(initData);

    return { isOk };
  } catch (error) {
    console.error(error);

    return {
      isOk: false,
      errors: returnValidationErrors(inputSchema, {
        _errors: [error instanceof Error ? error.message : String(error)],
      }),
    };
  }
});
