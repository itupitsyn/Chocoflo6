'use server';

import z from 'zod';

import { verifyTelegramAuth } from '@/lib/utils/telegram-auth';

import { isAdmin as isAdminChecker } from '../utils/is-admin';
import { actionClient } from './safe-action';

const inputSchema = z.object({
  initData: z.string(),
});

export const tgAuthAction = actionClient.inputSchema(inputSchema).action(async ({ parsedInput: { initData } }) => {
  try {
    const isOk = await verifyTelegramAuth(initData);
    const isAdmin = isOk ? isAdminChecker(initData) : false;

    return { isOk, isAdmin };
  } catch (error) {
    console.error(error);

    return {
      isOk: false,
      isAdmin: false,
      error,
    };
  }
});
