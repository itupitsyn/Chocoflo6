'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { FC, useCallback, useEffect } from 'react';
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
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { addProductAction } from '@/lib/actions/add-product-action';
import { Option } from '@/lib/generated/prisma/client';
import { addProductInputSchema } from '@/lib/schemas/add-product-schema';
import { NormalizePrice } from '@/lib/types';

import { Checkbox } from '../ui/checkbox';
import { ImageUploader } from '../ui/image-uploader';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '../ui/input-group';
import { Label } from '../ui/label';

const FORM_ID = 'add-product-form';

interface AddProductFormProps {
  isOpen: boolean;
  opts: NormalizePrice<Option>[];
  onOpenChange: (isOpen: boolean) => void;
}

export const AddProductForm: FC<AddProductFormProps> = ({ isOpen, opts, onOpenChange }) => {
  const methods = useForm<z.infer<typeof addProductInputSchema>>({
    defaultValues: {
      description: '',
      images: [],
      name: '',
      options: [],
      variants: [{ name: 'Стандарт', price: 0 }],
    },
    resolver: zodResolver(addProductInputSchema),
  });

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = methods;

  const {
    append: imgAppend,
    remove: imgRemove,
    fields: imgFields,
  } = useFieldArray({ control, name: 'images', keyName: 'id' });

  const {
    append: optAppend,
    remove: optRemove,
    fields: optFields,
  } = useFieldArray({ control, name: 'options', keyName: 'optId' });

  const {
    remove: varRemove,
    insert: varInsert,
    fields: varFields,
  } = useFieldArray({ control, name: 'variants', keyName: 'varId' });

  const onSubmit: SubmitHandler<z.infer<typeof addProductInputSchema>> = useCallback(
    async (data) => {
      try {
        const response = await addProductAction(data);
        if (response.serverError) {
          console.error(response.serverError);
          toast.error(response.serverError);
          return;
        }
        onOpenChange(false);
        reset();
      } catch (e) {
        console.error(e);
        toast.error('Неизвестная ошибка');
      }
    },
    [reset, onOpenChange],
  );

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              name="code"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor={field.name}>Артикул</FieldLabel>
                  <Input
                    {...field}
                    value={field.value || ''}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Артикул"
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

            <FieldGroup className="gap-2! pt-4">
              <FieldLabel>Доступные варианты</FieldLabel>

              {varFields.map((variant, idx) => {
                return (
                  <Field key={variant.varId} orientation="horizontal" className="items-start">
                    <Controller
                      control={control}
                      name={`variants.${idx}.name`}
                      render={({ field, fieldState }) => (
                        <Field>
                          <Input {...field} placeholder="Имя" aria-invalid={fieldState.invalid} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      control={control}
                      name={`variants.${idx}.price`}
                      render={({ field, fieldState }) => (
                        <Field>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            placeholder="Цена"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        varInsert(idx + 1, { name: '', price: 0 });
                      }}
                      size="icon-sm"
                      variant="outline"
                    >
                      <PlusIcon />
                    </Button>

                    {varFields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => {
                          varRemove(idx);
                        }}
                        size="icon-sm"
                        variant="destructive"
                      >
                        <TrashIcon />
                      </Button>
                    )}
                  </Field>
                );
              })}
            </FieldGroup>

            <Controller
              name="options"
              control={control}
              render={({ field }) => {
                return (
                  <FieldGroup className="gap-2! pt-4">
                    <FieldLabel>Доступные опции</FieldLabel>
                    {opts.map((item) => {
                      const optIdx = optFields.findIndex((oItem) => oItem.id === item.id);
                      const isChecked = optIdx >= 0;
                      return (
                        <Field key={item.id} orientation="horizontal">
                          <Checkbox
                            id={item.id}
                            onBlur={field.onBlur}
                            checked={isChecked}
                            onClick={() => {
                              if (isChecked) {
                                optRemove(optIdx);
                              } else {
                                optAppend({ id: item.id, name: item.name });
                              }
                            }}
                          />
                          <Label htmlFor={item.id} className="block min-w-0 overflow-hidden text-ellipsis">
                            {item.name}
                          </Label>
                        </Field>
                      );
                    })}
                  </FieldGroup>
                );
              }}
            />

            <Controller
              name="images"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid} className="gap-2 pt-4">
                    <FieldLabel htmlFor={field.name}>Изображения</FieldLabel>
                    <ImageUploader
                      images={imgFields.map((item) => ({ ...item, uploaded: false }))}
                      onDrop={(data) => {
                        data.forEach((file) =>
                          imgAppend({
                            id: Math.random(),
                            src: window.URL.createObjectURL(file),
                            file,
                          }),
                        );
                      }}
                      onDelete={(img) => {
                        const idx = imgFields.findIndex((item) => item.id === img.id);
                        if (idx >= 0) {
                          imgRemove(idx);
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
};
