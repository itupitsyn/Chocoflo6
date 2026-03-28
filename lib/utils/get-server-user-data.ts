'use server';

import { cookies } from 'next/headers';

import { TG_COOKIES } from '../constants/cookies';
import { getTelegramUser } from './get-telegram-user';
import { isAdmin } from './is-admin';
import { verifyTelegramAuth } from './telegram-auth';

export const getServerUserData = async () => {
  const cks = await cookies();
  const initData = cks.get(TG_COOKIES)?.value;

  const canEdit = isAdmin(initData);

  const isOk = await verifyTelegramAuth(initData);
  const user = getTelegramUser(initData);

  const isCustomer = isOk && !canEdit && !!user;
  return { isCustomer, canEdit, isOk, user };
};
