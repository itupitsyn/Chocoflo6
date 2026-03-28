'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon, PlusIcon, TrashIcon } from 'lucide-react';
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
import { editProductAction } from '@/lib/actions/edit-product-action';
import { Option, Product, Variant } from '@/lib/generated/prisma/client';
import { editProductInputSchema } from '@/lib/schemas/edit-product-schema';
import { optionSchema } from '@/lib/schemas/option-schema';
import { NormalizePrice } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';

import { Checkbox } from '../ui/checkbox';
import { ImageUploader } from '../ui/image-uploader';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '../ui/input-group';
import { Label } from '../ui/label';

const FORM_ID = 'edit-product-form';

interface EditProductFormProps {
  product: Product;
  productOptions: z.infer<typeof optionSchema>[];
  variants: NormalizePrice<Variant>[];
  opts: NormalizePrice<Option>[];
}

export const EditProductForm: FC<EditProductFormProps> = ({ product, opts, variants, productOptions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<z.infer<typeof editProductInputSchema>>({
    defaultValues: {
      id: product.id,
      description: product.description || '',
      images: product.images.map((item, idx) => ({ id: idx + 1, src: item, uploaded: true })),
      name: product.name,
      code: product.code,
      options: productOptions,
      variants,
    },
    resolver: zodResolver(editProductInputSchema),
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
    append: varAppend,
    insert: varInsert,
    fields: varFields,
  } = useFieldArray({ control, name: 'variants', keyName: 'varId' });

  const onSubmit: SubmitHandler<z.infer<typeof editProductInputSchema>> = useCallback(
    async (data) => {
      try {
        const response = await editProductAction(data);
        if (response.serverError) {
          console.error(response.serverError);
          toast.error(response.serverError);
          return;
        }

        const { data: newData } = response;
        if (newData) {
          reset({
            id: newData.id,
            description: newData.description || '',
            images: newData.images.map((item, idx) => ({ id: idx + 1, src: item, uploaded: true })),
            name: newData.name,
            options: newData.productOptions.map((item) => item.option),
            variants: newData.variants.map((item) => ({ name: item.name, price: item.price })),
          });
        }
        setIsOpen(false);
      } catch (e) {
        console.error(e);
        toast.error('Неизвестная ошибка');
      }
    },
    [reset],
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
          <DialogTitle>Изменить вкусни</DialogTitle>
          <DialogDescription>Отредактировать вкуснически</DialogDescription>
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
                <Field data-invalid={fieldState.invalid}>
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

              {!varFields.length && (
                <Button
                  type="button"
                  onClick={() => {
                    varAppend({ name: '', price: 0 });
                  }}
                  size="icon-sm"
                  variant="outline"
                >
                  <PlusIcon />
                </Button>
              )}
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
                      images={imgFields.map((item) => ({
                        ...item,
                        src: item.uploaded ? (getImageUrl(item.src) ?? '') : item.src,
                      }))}
                      onDrop={(data) => {
                        data.forEach((file) =>
                          imgAppend({
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
                          imgRemove(idx);
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
