'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ShoppingBasketIcon } from 'lucide-react';
import { FC, useCallback, useId, useMemo } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm, useWatch } from 'react-hook-form';
import Select, { components } from 'react-select';
import { toast } from 'sonner';
import z from 'zod';

import { addToCartAction } from '@/lib/actions/add-to-cart-action';
import { Option, Product, Variant } from '@/lib/generated/prisma/client';
import { addToCartSchema } from '@/lib/schemas/add-to-cart-schema';
import { variantSchema } from '@/lib/schemas/variant-schema';
import { NormalizePrice } from '@/lib/types';
import { formatPrice, getSelectClassNames } from '@/lib/utils';

import { OptionImgSwiper } from '../option/option-img-swiper';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface AddToCartFormProps {
  product: Product;
  opts: NormalizePrice<Option>[];
  variants: NormalizePrice<Variant>[];
  orderCount: number;
}

type FormData = z.infer<typeof addToCartSchema>;

export const AddToCartForm: FC<AddToCartFormProps> = ({ opts, product, variants, orderCount }) => {
  const id = useId();

  const methods = useForm<FormData>({
    resolver: zodResolver(addToCartSchema),
    defaultValues: {
      count: 1,
      productId: product.id,
      variant: variants[0],
      options: [],
    },
  });

  const { control, handleSubmit } = methods;

  const {
    append: optAppend,
    remove: optRemove,
    fields: optFields,
  } = useFieldArray({ control, name: 'options', keyName: 'optId' });

  const onSubmit: SubmitHandler<FormData> = useCallback(async (data) => {
    try {
      const response = await addToCartAction(data);

      if (response.serverError) {
        console.error(response.serverError);
        toast.error(response.serverError);
        return;
      }

      toast.success('Успешно добавлено в корзину'!);
    } catch (e) {
      console.error(e);
      toast.error('Неизвестная ошибка');
    }
  }, []);

  const { options, variant } = useWatch({ control });

  const fullPrice = useMemo(() => {
    const found = variants.find((item) => item.id === variant?.id);
    return (
      (found?.price ?? 0) +
      opts.filter((item) => options?.some((opt) => opt.id === item.id))?.reduce((prev, curr) => prev + curr.price, 0)
    );
  }, [options, opts, variant?.id, variants]);

  return (
    <form noValidate>
      <FieldGroup className="gap-3">
        {variants.length > 1 ? (
          <Controller
            name="variant"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <Label htmlFor={`input-${id}`}>Вариант</Label>

                <Select<z.infer<typeof variantSchema>>
                  id={id}
                  inputId={`input-${id}`}
                  {...field}
                  unstyled
                  classNames={getSelectClassNames(fieldState.error?.message)}
                  options={variants}
                  components={{
                    Option: (props) => {
                      const price = variants.find((item) => item.id === props.data.id)?.price;

                      return (
                        <components.Option {...props}>
                          {price ? (
                            <>
                              {props.data.name}: <span className="font-light opacity-70">{formatPrice(price)}</span>
                            </>
                          ) : (
                            props.data.name
                          )}
                        </components.Option>
                      );
                    },
                    SingleValue: (props) => {
                      const price = variants.find((item) => item.id === props.data.id)?.price;
                      return (
                        <components.SingleValue {...props}>
                          {price ? (
                            <>
                              {props.data.name}: <span className="font-light opacity-70">{formatPrice(price)}</span>
                            </>
                          ) : (
                            props.data.name
                          )}
                        </components.SingleValue>
                      );
                    },
                  }}
                  getOptionValue={(variant) => variant.id}
                />
              </Field>
            )}
          />
        ) : variants.length ? (
          <div className="flex">
            {opts.length ? 'Базовая цена' : 'Цена'}:{' '}
            <span className="font-light text-black/70">{formatPrice(variants[0].price)}</span>
          </div>
        ) : null}

        {!!opts.length && (
          <Controller
            name="options"
            control={control}
            render={({ field }) => {
              return (
                <FieldGroup className="gap-2!">
                  <FieldLabel>Дополнения</FieldLabel>

                  {opts.map((item) => {
                    const optIdx = optFields.findIndex((oItem) => oItem.id === item.id);
                    const isChecked = optIdx >= 0;

                    return (
                      <Field key={item.id} orientation="horizontal">
                        <Checkbox
                          id={`${product.id}-${item.id}`}
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
                        <Label htmlFor={`${product.id}-${item.id}`} className="overflow-hidden">
                          <Popover>
                            <PopoverTrigger className="flex overflow-hidden text-ellipsis">
                              <span className="min-w-0 overflow-hidden text-ellipsis">{item.name}</span>
                              <span>:</span>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                              <h3 className="mb-2 overflow-hidden text-xl font-semibold text-ellipsis">{item.name}</h3>
                              <OptionImgSwiper images={item.images} />
                            </PopoverContent>
                          </Popover>
                          <span className="font-light text-black/70">
                            {`${isChecked ? '+' : ''}${formatPrice(item.price)}`}
                          </span>
                        </Label>
                      </Field>
                    );
                  })}
                </FieldGroup>
              );
            }}
          />
        )}
      </FieldGroup>

      <div className="flex items-center justify-end gap-4">
        <div>
          <div className="my-1 text-end text-sm opacity-70">
            {orderCount ? `В корзине:\u00A0${orderCount}` : '\u00A0'}
          </div>
          <Button onClick={handleSubmit(onSubmit)}>
            <ShoppingBasketIcon />

            {formatPrice(fullPrice)}
          </Button>
        </div>
      </div>
    </form>
  );
};
