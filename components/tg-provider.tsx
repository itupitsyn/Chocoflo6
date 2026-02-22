'use client';

import Script from 'next/script';
import { createContext, FC, PropsWithChildren, useContext, useMemo, useState } from 'react';

import { setInitTgCookie } from '@/lib/actions/set-init-data-cookie';
import { tgAuthAction } from '@/lib/actions/tg-auth-action';

type TgContextType = {
  isReady: boolean;
  isOk: boolean;
  isTg: boolean;
};

const TgContext = createContext<TgContextType>({ isReady: false, isOk: false, isTg: false });

export const TgProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isOk, setIsOk] = useState(false);
  const [isTg, setIsTg] = useState(false);

  const value = useMemo(() => ({ isReady, isOk, isTg }), [isReady, isOk, isTg]);

  return (
    <TgContext.Provider value={value}>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onLoad={async () => {
          const tg = window.Telegram.WebApp;
          const initData = window.Telegram.WebApp.initData;
          const [{ data }] = await Promise.all([tgAuthAction({ initData }), setInitTgCookie({ initData })]);

          if (initData) {
            setIsTg(!!tg.initData);
            setIsOk(!!data?.isOk);
            tg.ready();
            tg.expand();
          }

          setIsReady(true);
        }}
      />
      {children}
    </TgContext.Provider>
  );
};

export const useTgContext = () => {
  const ctx = useContext(TgContext);

  return ctx;
};
