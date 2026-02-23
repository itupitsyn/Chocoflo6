'use client';

import { EyeClosedIcon, EyeIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';
import { toast } from 'sonner';

import { changeProductVisibilityAction } from '@/lib/actions/change-product-visibility-action';
import { deleteProductAction } from '@/lib/actions/delete-product-action';

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
} from './ui/alert-dialog';
import { Button } from './ui/button';

interface DeleteProductButtonProps {
  id: string;
}

export const DeleteProductButton: FC<DeleteProductButtonProps> = ({ id }) => {
  const { refresh } = useRouter();

  const onChangeVisibility = useCallback(async () => {
    try {
      const response = await deleteProductAction({ id });
      if (response.serverError) {
        console.error(response.serverError);
        toast.error(response.serverError);
        return;
      }

      refresh();
    } catch (e) {
      console.error(e);
      toast.error('Неизвестная ошибка');
    }
  }, [id, refresh]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon-sm">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить вкусни?</AlertDialogTitle>
          <AlertDialogDescription>Это действие отменить нельзя</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={onChangeVisibility}>Удалить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
