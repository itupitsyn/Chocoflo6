'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { submitOrderAction } from '@/lib/actions/submit-order-action';
import { submitOrderSchema } from '@/lib/schemas/submit-order-schema';

import { Button } from '../ui/button';

interface SubmitOrderProps {
  orderId: number;
}

type FormData = z.infer<typeof submitOrderSchema>;

export const SubmitOrder: FC<SubmitOrderProps> = ({ orderId }) => {
  const methods = useForm<FormData>({
    defaultValues: { orderId },
    resolver: zodResolver(submitOrderSchema),
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = methods;

  const onSubmit: SubmitHandler<FormData> = useCallback(async (data) => {
    try {
      const response = await submitOrderAction(data);
      if (response.serverError) {
        console.error(response.serverError);
        toast.error(response.serverError);
        return;
      }
      toast.success('Заказ успешно оформлен!');
    } catch (err: unknown) {
      if (err instanceof Error && err.message?.includes('NEXT_REDIRECT')) {
        return;
      }

      console.error(err);
      toast.error('Неизвестная ошибка');
    }
  }, []);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit" disabled={isSubmitting}>
        Заказать
      </Button>
    </form>
  );
};
