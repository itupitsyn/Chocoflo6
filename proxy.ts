import { NextRequest } from 'next/server';

import { verifyTelegramAuth } from './lib/utils';

export const proxy = async (req: NextRequest) => {
  // const initData = req.cookies.get('tg-init-data')?.value;
  // const isOk = await verifyTelegramAuth(initData ?? '');
  // console.log({ isOk });

  // const isOk = initData ? await verifyTelegramAuth(initData) : false;
};
