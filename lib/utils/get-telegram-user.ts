import { TgUser } from '../types';

export const getTelegramUser = (initData: string | undefined): TgUser | null => {
  if (!initData) {
    return null;
  }

  try {
    const decodedData = decodeURIComponent(initData);
    const urlParams = new URLSearchParams(decodedData);
    const usrParam = urlParams.get('user');

    if (usrParam) {
      return JSON.parse(usrParam);
    }

    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
