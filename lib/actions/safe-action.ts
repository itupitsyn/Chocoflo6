import { cookies } from 'next/headers';
import { createSafeActionClient } from 'next-safe-action';

import { TG_COOKIES } from '../constants/cookies';
import { getTelegramUser, isAdmin, verifyTelegramAuth } from '../utils';

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) {
      return e.message;
    }
    return 'Произошла неизвестная ошибка, заюш!';
  },
});

export const adminActionClient = actionClient.use(async ({ next }) => {
  const cks = await cookies();
  const initData = cks.get(TG_COOKIES);
  const isOk = await verifyTelegramAuth(initData?.value);
  const isAdm = isAdmin(initData?.value);

  if (!isOk || !isAdm) {
    throw new Error('You are not admin');
  }

  return next();
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const cks = await cookies();
  const initData = cks.get(TG_COOKIES)?.value;
  const isOk = await verifyTelegramAuth(initData);
  const user = getTelegramUser(initData);

  if (!isOk || !user) {
    throw new Error('You are not valid tg user');
  }

  return next({ ctx: { user } });
});
