import { ShoppingBasketIcon } from 'lucide-react';
import Link from 'next/link';

import { AdminMenu } from '@/components/admin-menu';
import { CustomerMenu } from '@/components/customer-menu';
import { AddToCartForm } from '@/components/order/add-to-cart-form';
import { ChangeProductVisibilityButton } from '@/components/product/change-product-visibility-button';
import { DeleteProductButton } from '@/components/product/delete-product-button';
import { EditProductForm } from '@/components/product/edit-product-form';
import { ImageSwiper } from '@/components/product/image-swiper';
import { SearchInput } from '@/components/search-input';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentOrder } from '@/lib/data/order';
import { Option } from '@/lib/generated/prisma/client';
import { ProductFindManyArgs } from '@/lib/generated/prisma/models';
import { PageParams } from '@/lib/types';
import { cn, normalizePrice } from '@/lib/utils';
import { getServerUserData } from '@/lib/utils/get-server-user-data';
import prisma from '@/prisma/prisma';

export default async function Page(params: PageParams) {
  const pageParams = await params.searchParams;

  const search = Array.isArray(pageParams['search']) ? pageParams['search'][0] : pageParams['search'];

  const { canEdit, isCustomer, user } = await getServerUserData();

  const searchClause: ProductFindManyArgs['where'] = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }
    : {};

  const [data, opts, order] = await Promise.all([
    prisma.product.findMany({
      include: {
        variants: {
          where: {
            deletedAt: null,
          },
        },
        productOptions: {
          select: {
            option: true,
          },
        },
      },
      where: {
        isPublished: canEdit ? undefined : true,
        deletedAt: null,
        ...searchClause,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    }),
    canEdit
      ? prisma.option.findMany({
          where: {
            deletedAt: null,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        })
      : ([] as Option[]),
    getCurrentOrder(user?.id),
  ]);

  return (
    <main className="container mt-5 mb-20">
      <div className="flex items-start justify-between gap-8">
        <h1 className="text-3xl font-bold lg:text-5xl">Точка шоколада Химки</h1>

        {canEdit && (
          <div className="flex justify-end">
            <AdminMenu opts={opts.map(normalizePrice)} />
          </div>
        )}

        {isCustomer && (
          <div className="relative flex justify-end gap-2">
            <CustomerMenu />
            <Button asChild variant="outline" size="icon-sm">
              <Link href="/cart">
                <ShoppingBasketIcon />
              </Link>
            </Button>

            {!!order?.items.length && (
              <div className="absolute -right-2 -bottom-2 flex size-5 items-center justify-center rounded-full border-2 border-solid border-white bg-red-400 text-xs text-white shadow-lg">
                {order.items.reduce<number>((prev, curr) => {
                  return prev + curr.count;
                }, 0)}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4">
        <SearchInput baseUrl="/" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 pt-4">
        {data.map((item, idx, list) => {
          const { productOptions, variants, ...product } = item;

          return (
            <Card key={item.id} className={cn(list.length < 2 && 'sm:max-w-1/2')}>
              <CardHeader>
                <CardTitle className="overflow-hidden text-ellipsis">{item.name}</CardTitle>

                {canEdit && (
                  <CardAction>
                    <div className="flex gap-2">
                      <DeleteProductButton id={item.id} />

                      <ChangeProductVisibilityButton id={item.id} isPublished={item.isPublished} />

                      <EditProductForm
                        opts={opts.map(normalizePrice)}
                        productOptions={productOptions.map((optItem) => ({
                          id: optItem.option.id,
                          name: optItem.option.name,
                        }))}
                        variants={variants.map(normalizePrice)}
                        product={product}
                      />
                    </div>
                  </CardAction>
                )}

                <CardDescription>Арт: {item.code}</CardDescription>
              </CardHeader>

              <CardContent className="flex grow flex-col justify-between gap-3 whitespace-pre-wrap">
                <div className="flex flex-col gap-3">
                  <ImageSwiper images={item.images} />

                  <p>{item.description}</p>

                  {canEdit && !!variants.length && (
                    <p className="overflow-hidden text-sm text-ellipsis opacity-70">
                      Варианты: {variants.map((varItem) => varItem.name).join(', ')}
                    </p>
                  )}

                  {canEdit && !!productOptions.length && (
                    <p className="overflow-hidden text-sm text-ellipsis opacity-70">
                      Доступные опции: {productOptions.map((optItem) => optItem.option.name).join(', ')}
                    </p>
                  )}
                </div>

                {isCustomer && (
                  <AddToCartForm
                    opts={productOptions.map((po) => normalizePrice(po.option))}
                    product={product}
                    variants={variants.map(normalizePrice)}
                    orderCount={
                      order?.items.reduce<number>((prev, curr) => {
                        return curr.product.id === item.id ? prev + curr.count : prev;
                      }, 0) ?? 0
                    }
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
