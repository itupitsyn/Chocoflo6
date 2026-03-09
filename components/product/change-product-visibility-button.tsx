'use client';

import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';
import { toast } from 'sonner';

import { changeProductVisibilityAction } from '@/lib/actions/change-product-visibility-action';

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

interface ChangeProductVisibilityButtonProps {
  id: string;
  isPublished: boolean;
}

export const ChangeProductVisibilityButton: FC<ChangeProductVisibilityButtonProps> = ({ id, isPublished }) => {
  const { refresh } = useRouter();

  const onChangeVisibility = useCallback(async () => {
    try {
      const response = await changeProductVisibilityAction({ id, isHidden: isPublished });
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
  }, [id, isPublished, refresh]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          {isPublished ? <EyeIcon /> : <EyeClosedIcon />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`${isPublished ? 'Скрыть' : 'Показать'} запись?`}</AlertDialogTitle>
          <AlertDialogDescription>Видимость изменится для всех пользователей</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={onChangeVisibility}>{`${isPublished ? 'Скрыть' : 'Показать'}`}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
