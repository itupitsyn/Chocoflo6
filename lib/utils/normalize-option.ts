import { Option } from '../generated/prisma/client';
import { NormalizedOption } from '../types/options';

export const normalizeOption = (opt: Option): NormalizedOption => {
  return { ...opt, price: opt.price.toNumber() };
};
