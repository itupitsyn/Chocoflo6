import { cookies } from 'next/headers';

import { AddToCartForm } from '@/components/add-to-cart-form';
import { AdminMenu } from '@/components/admin-menu';
import { ChangeProductVisibilityButton } from '@/components/product/change-product-visibility-button';
import { DeleteProductButton } from '@/components/product/delete-product-button';
import { EditProductForm } from '@/components/product/edit-product-form';
import { ImageSwiper } from '@/components/product/image-swiper';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TG_COOKIES } from '@/lib/constants/cookies';
import { Option } from '@/lib/generated/prisma/client';
import { cn, getTelegramUser, isAdmin, normalizePrice, verifyTelegramAuth } from '@/lib/utils';
import prisma from '@/prisma/prisma';

export default async function Page() {
  const cks = await cookies();
  const initData = cks.get(TG_COOKIES)?.value;
  const canEdit = isAdmin(initData);
  const isOk = await verifyTelegramAuth(initData);

  const user = getTelegramUser(initData);

  const isCustomer = isOk && !canEdit && !!user;

  const [data, opts] = await Promise.all([
    prisma.product.findMany({
      include: {
        variants: true,
        productOptions: {
          select: {
            option: true,
          },
        },
      },
      where: {
        isPublished: canEdit ? undefined : true,
        deletedAt: null,
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
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 pt-10">
        {data.map((item, idx, list) => {
          const { productOptions, variants, ...product } = item;

          return (
            <Card key={item.id} className={cn(list.length < 2 && 'sm:max-w-1/2')}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>

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
                        product={product}
                      />
                    </div>
                  </CardAction>
                )}

                <CardDescription>{item.code}</CardDescription>
              </CardHeader>

              <CardContent className="flex grow flex-col gap-6 whitespace-pre-wrap">
                <ImageSwiper images={item.images} />

                <p>{item.description}</p>

                {isCustomer && (
                  <AddToCartForm
                    opts={productOptions.map((po) => normalizePrice(po.option))}
                    product={product}
                    variants={variants.map(normalizePrice)}
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
