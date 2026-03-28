'use client';

import { TrashIcon } from 'lucide-react';
import { FC, useCallback } from 'react';
import { toast } from 'sonner';

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
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

interface DeleteProductButtonProps {
  id: string;
}

export const DeleteProductButton: FC<DeleteProductButtonProps> = ({ id }) => {
  const onDeleteClick = useCallback(async () => {
    try {
      const response = await deleteProductAction({ id });
      if (response.serverError) {
        console.error(response.serverError);
        toast.error(response.serverError);
        return;
      }
    } catch (e) {
      console.error(e);
      toast.error('Неизвестная ошибка');
    }
  }, [id]);

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
          <AlertDialogAction onClick={onDeleteClick}>Удалить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
