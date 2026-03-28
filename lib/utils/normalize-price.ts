import { Decimal } from '@prisma/client/runtime/client';

import { NormalizePrice } from '../types';

export const normalizePrice = <T extends { price: Decimal }>(val: T): NormalizePrice<T> => {
  return { ...val, price: val.price.toNumber() };
};
