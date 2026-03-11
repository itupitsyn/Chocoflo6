'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { editOptionAction } from '@/lib/actions/edit-option-action';
import { editOptionInputSchema } from '@/lib/schemas/edit-option-schema';
import { NormalizedOption } from '@/lib/types/options';
import { getImageUrl } from '@/lib/utils';

import { ImageUploader } from '../ui/image-uploader';

const FORM_ID = 'edit-option-form';

interface EditOptionFormProps {
  option: NormalizedOption;
}

export const EditOptionForm: FC<EditOptionFormProps> = ({ option }) => {
  const { refresh } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<z.infer<typeof editOptionInputSchema>>({
    defaultValues: {
      id: option.id,
      price: option.price,
      images: option.images.map((item, idx) => ({ id: idx + 1, src: item, uploaded: true })),
      name: option.name,
    },
    resolver: zodResolver(editOptionInputSchema),
  });

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = methods;

  const { append, remove, fields: imgFields } = useFieldArray({ control, name: 'images', keyName: 'id' });

  const onSubmit: SubmitHandler<z.infer<typeof editOptionInputSchema>> = useCallback(
    async (data) => {
      try {
        const response = await editOptionAction(data);
        if (response.serverError) {
          console.error(response.serverError);
          toast.error(response.serverError);
          return;
        }

        const { data: newData } = response;
        if (newData) {
          reset({
            id: newData.id,
            price: newData.price,
            images: newData.images.map((item, idx) => ({ id: idx + 1, src: item, uploaded: true })),
            name: newData.name,
          });
        }
        setIsOpen(false);
        refresh();
      } catch (e) {
        console.error(e);
        toast.error('Неизвестная ошибка');
      }
    },
    [refresh, reset],
  );

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <EditIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-svh flex-col gap-4 overflow-hidden lg:max-w-lg">
        <DialogHeader>
          <DialogTitle>Добавить вкусни</DialogTitle>
          <DialogDescription>Добавьте новое вкуснически</DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} id={FORM_ID} className="min-h-0 shrink overflow-y-auto px-1">
          <FieldGroup className="gap-3">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Название</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Название вкусни"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Цена</FieldLabel>
                  <Input
                    {...field}
                    value={field.value || ''}
                    type="number"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Цена"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="images"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>Изображения</FieldLabel>
                    <ImageUploader
                      images={imgFields.map((item) => ({
                        ...item,
                        src: item.uploaded ? (getImageUrl(item.src) ?? '') : item.src,
                      }))}
                      onDrop={(data) => {
                        data.forEach((file) =>
                          append({
                            id: Math.random(),
                            src: window.URL.createObjectURL(file),
                            file,
                            uploaded: false,
                          }),
                        );
                      }}
                      onDelete={(img) => {
                        const idx = imgFields.findIndex((item) => item.id === img.id);
                        if (idx >= 0) {
                          remove(idx);
                        }
                      }}
                    />

                    {!!errors.images?.length && (
                      <FieldError
                        errors={
                          errors.images
                            .filter?.((item) => item && 'file' in item)
                            ?.map((item) =>
                              item &&
                              'file' in item &&
                              item.file &&
                              typeof item.file === 'object' &&
                              'message' in item.file &&
                              typeof item.file.message === 'string'
                                ? { message: item.file.message }
                                : { message: '' },
                            ) ?? []
                        }
                      />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button form={FORM_ID} disabled={isSubmitting} type="submit">
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
