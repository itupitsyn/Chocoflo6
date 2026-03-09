'use client';

import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { Option } from '@/lib/generated/prisma/client';
import { formatPrice } from '@/lib/utils';

import { Card } from '../ui/card';

interface OptionItemProps {
  option: Omit<Option, 'price'> & { price: number };
}

export const OptionItem: FC<OptionItemProps> = ({ option }) => {
  const { refresh } = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <Card>
      {option.name}
      {formatPrice(option.price)}
    </Card>
  );
};
