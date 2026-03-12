import { cookies } from 'next/headers';
import { createSafeActionClient } from 'next-safe-action';

import { TG_COOKIES } from '../constants/cookies';
import { isAdmin, verifyTelegramAuth } from '../utils';

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) {
      return e.message;
    }
    return 'Произошла неизвестная ошибка, заюш!';
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const cks = await cookies();
  const initData = cks.get(TG_COOKIES);
  const isOk = await verifyTelegramAuth(initData?.value);
  const isAdm = isAdmin(initData?.value);

  if (!isOk || !isAdm) {
    throw new Error('You are not admin');
  }

  return next();
});
