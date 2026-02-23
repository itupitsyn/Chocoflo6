'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
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
import { addProductAction } from '@/lib/actions/add-product-action';
import { addProductInputSchema } from '@/lib/schemas/add-product-schema';

import { ImageUploader } from './ui/image-uploader';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from './ui/input-group';

const FORM_ID = 'add-product-form';

export function AddProductForm() {
  const { refresh } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<z.infer<typeof addProductInputSchema>>({
    defaultValues: {
      description: '',
      images: [],
      name: '',
    },
    resolver: zodResolver(addProductInputSchema),
  });

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = methods;

  const { append, remove, fields: imgFields } = useFieldArray({ control, name: 'images', keyName: 'id' });

  const onSubmit: SubmitHandler<z.infer<typeof addProductInputSchema>> = useCallback(
    async (data) => {
      try {
        await addProductAction(data);
        reset();
        refresh();
        setIsOpen(false);
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
        <Button variant="outline" size="icon-lg">
          <PlusIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-svh flex-col gap-4 overflow-hidden sm:max-w-sm">
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
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor={field.name}>Описание</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id={field.name}
                      placeholder="Описание вкусни"
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">{field.value.length}/1024</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
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
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
