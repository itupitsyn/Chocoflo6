'use client';

import { FC, PropsWithChildren } from 'react';

import { Loader } from './loader';
import { useTgContext } from './tg-provider';

export const AuthProtection: FC<PropsWithChildren> = ({ children }) => {
  const { isOk, isReady, isTg } = useTgContext();

  if (isTg && !isOk) {
    return null;
  }

  if (isReady) {
    return children;
  }

  return <Loader />;
};
