'use client';

import { FC } from 'react';

import { Option, Product, Variant } from '@/lib/generated/prisma/client';
import { NormalizePrice } from '@/lib/types';

interface AddToCartFormProps {
  product: Product;
  opts: NormalizePrice<Option>[];
  variants: NormalizePrice<Variant>[];
}

export const AddToCartForm: FC<AddToCartFormProps> = ({ opts, product, variants }) => {
  return (
    <form noValidate>
      {opts.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </form>
  );
};
