import { Option } from '../generated/prisma/client';

export type NormalizedOption = Omit<Option, 'price'> & { price: number };
