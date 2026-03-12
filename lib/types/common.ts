import { Decimal } from '@prisma/client/runtime/client';

export type NormalizePrice<T extends { price: Decimal }> = Omit<T, 'price'> & { price: number };
