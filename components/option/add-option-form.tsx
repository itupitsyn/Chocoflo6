'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { addOptionAction } from '@/lib/actions/add-option-action';
import { addOptionInputSchema } from '@/lib/schemas/add-option-schema';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { ImageUploader } from '../ui/image-uploader';
import { Input } from '../ui/input';

const FORM_ID = 'add-option-form';

export const AddOptionForm: FC = () => {
  const { refresh } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<z.infer<typeof addOptionInputSchema>>({
    defaultValues: {
      name: '',
      images: [],
    },
    resolver: zodResolver(addOptionInputSchema),
  });

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = methods;

  const { append, remove, fields: imgFields } = useFieldArray({ control, name: 'images', keyName: 'id' });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<z.infer<typeof addOptionInputSchema>> = useCallback(
    async (data) => {
      try {
        const response = await addOptionAction(data);
        if (response.serverError) {
          console.error(response.serverError);
          toast.error(response.serverError);
          return;
        }
        setIsOpen(false);
        reset();
        refresh();
      } catch (e) {
        console.error(e);
        toast.error('Неизвестная ошибка');
      }
    },
    [refresh, reset],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-svh flex-col gap-4 overflow-hidden lg:max-w-lg">
        <DialogHeader>
          <DialogTitle>Добавить дополнение</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} id={FORM_ID} className="min-h-0 shrink overflow-y-auto p-1">
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
                    placeholder="Название"
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
                      images={imgFields.map((item) => ({ ...item, uploaded: false }))}
                      onDrop={(data) => {
                        data.forEach((file) =>
                          append({
                            id: Math.random(),
                            src: window.URL.createObjectURL(file),
                            file,
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

                    {fieldState.invalid && <FieldError errors={errors.images?.map?.((item) => item?.file)} />}
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
