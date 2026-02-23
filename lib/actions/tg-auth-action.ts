'use server';

import z from 'zod';

import { isAdmin as isAdminChecker, verifyTelegramAuth } from '../utils';
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
