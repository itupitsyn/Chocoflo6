'use client';

import { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';

import { editCartItemAction } from '@/lib/actions/edit-cart-item-action';

import { Button } from '../ui/button';

interface OrderItemCountProps {
  count: number;
  id: string;
}

export const OrderItemCount: FC<OrderItemCountProps> = ({ count, id }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeCount = useCallback(
    async (count: number) => {
      try {
        setIsSubmitting(true);
        const response = await editCartItemAction({ count, id });

        if (response.serverError) {
          console.error(response.serverError);
          toast.error(response.serverError);
        }
      } catch (e) {
        console.error(e);
        toast.error('Неизвестная ошибка');
      } finally {
        setIsSubmitting(false);
      }
    },
    [id],
  );

  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={isSubmitting}
        variant="ghost"
        size="icon-xs"
        onClick={() => {
          changeCount(-1);
        }}
      >
        -
      </Button>
      <span>{count}</span>
      <Button
        disabled={isSubmitting}
        variant="ghost"
        size="icon-xs"
        onClick={() => {
          changeCount(1);
        }}
      >
        +
      </Button>
    </div>
  );
};
