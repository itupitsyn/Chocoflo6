'use server';

import { cookies } from 'next/headers';
import z from 'zod';

import { TG_COOKIES } from '../constants/cookies';
import { actionClient } from './safe-action';

const inputSchema = z.object({
  initData: z.string(),
});

export const setInitTgCookie = actionClient.inputSchema(inputSchema).action(async ({ parsedInput: { initData } }) => {
  const cks = await cookies();

  cks.set(TG_COOKIES, initData, {
    httpOnly: true,
    maxAge: 86400,
    sameSite: 'lax',
    secure: true,
  });
});
