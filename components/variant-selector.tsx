'use client';

import { FC, useId } from 'react';
import Select from 'react-select';

import { Variant } from '@/lib/generated/prisma/client';
import { getSelectClassNames } from '@/lib/utils/get-select-classnames';

import { formatPrice } from './format-price';

interface VariantSelectorProps {
  variants: (Omit<Variant, 'price'> & { price: number })[];
  className?: string;
}

export const VariantSelector: FC<VariantSelectorProps> = ({ variants, className }) => {
  const id = useId();

  if (!variants.length) {
    return null;
  }

  if (variants.length === 1) {
    return variants[0].name
      ? `${variants[0].name} — ${formatPrice(variants[0].price)}`
      : formatPrice(variants[0].price);
  }

  return (
    <Select
      id={id}
      options={variants.map((item) => ({
        label: `${item.name} — ${formatPrice(item.price)}`,
        value: item.id,
      }))}
      isSearchable={false}
      placeholder="Вариант"
      unstyled
      menuPosition="fixed"
      className={className}
      classNames={getSelectClassNames()}
    />
  );
};
