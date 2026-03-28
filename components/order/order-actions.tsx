'use client';

import { CircleCheckBigIcon, CircleOff, PackageOpenIcon } from 'lucide-react';
import { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';

import { cancelOrderAction } from '@/lib/actions/cancel-order-action';
import { finishOrderAction } from '@/lib/actions/finish-order-action';
import { reopenOrderAction } from '@/lib/actions/reopen-order-action';
import { OrderStatus } from '@/lib/generated/prisma/enums';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

interface OrderActionsProps {
  orderId: number;
  status: OrderStatus;
}

export const OrderActions: FC<OrderActionsProps> = ({ orderId, status }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinishClick = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const response = await finishOrderAction({ id: orderId });
      if (response.serverError) {
        console.error(response.serverError);
        toast.error(response.serverError);
        return;
      }
    } catch (e) {
      console.error(e);
      toast.error('Неизвестная ошибка');
    } finally {
      setIsSubmitting(false);
    }
  }, [orderId]);

  const onCancelClick = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const response = await cancelOrderAction({ id: orderId });
      if (response.serverError) {
        console.error(response.serverError);
        toast.error(response.serverError);
        return;
      }
    } catch (e) {
      console.error(e);
      toast.error('Неизвестная ошибка');
    } finally {
      setIsSubmitting(false);
    }
  }, [orderId]);

  const onReopenClick = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const response = await reopenOrderAction({ id: orderId });
      if (response.serverError) {
        console.error(response.serverError);
        toast.error(response.serverError);
        return;
      }
    } catch (e) {
      console.error(e);
      toast.error('Неизвестная ошибка');
    } finally {
      setIsSubmitting(false);
    }
  }, [orderId]);

  return (
    <div className="flex justify-end gap-1">
      {status === 'PROCESSING' || status === 'PENDING' || status === 'SHIPPING' ? (
        <>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isSubmitting} type="button" variant="ghost" size="icon-sm">
                <CircleCheckBigIcon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Завершить заказ?</AlertDialogTitle>
                <AlertDialogDescription>Заказ будет переведен в статус Завершен</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Нет</AlertDialogCancel>
                <AlertDialogAction onClick={onFinishClick}>Завершить</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isSubmitting} type="button" variant="ghost" size="icon-sm">
                <CircleOff />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Отменить заказ?</AlertDialogTitle>
                <AlertDialogDescription>Заказ будет переведен в статус Оменен</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Нет</AlertDialogCancel>
                <AlertDialogAction onClick={onCancelClick}>Да</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isSubmitting} type="button" variant="ghost" size="icon-sm">
              <PackageOpenIcon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Открыть заказ повторно?</AlertDialogTitle>
              <AlertDialogDescription>Заказ будет переведен в статус В работе</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={onReopenClick}>Открыть</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
