import { cookies } from 'next/headers';

import { AddProductForm } from '@/components/add-porduct-form';
import { ChangeProductVisibilityButton } from '@/components/change-product-visibility-button';
import { DeleteProductButton } from '@/components/delete-product-button';
import { EditProductForm } from '@/components/edit-product-form';
import { ImageSwiper } from '@/components/image-swiper';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TG_COOKIES } from '@/lib/constants/cookies';
import { isAdmin } from '@/lib/utils';
import prisma from '@/prisma/prisma';

export default async function Page() {
  const vals = await cookies();
  const initData = vals.get(TG_COOKIES)?.value;
  const canEdit = isAdmin(initData);

  const data = await prisma.product.findMany({
    include: {
      variants: true,
    },
    where: {
      isPublished: canEdit ? undefined : true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <main className="container mt-10 mb-20">
      <div className="flex items-start gap-8 lg:items-center">
        <h1 className="text-3xl font-bold lg:text-5xl">Точка шоколада Химки</h1>
        {canEdit && <AddProductForm />}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 pt-10">
        {data.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>

              {canEdit && (
                <CardAction>
                  <div className="flex gap-2">
                    <DeleteProductButton id={item.id} />

                    <ChangeProductVisibilityButton id={item.id} isPublished={item.isPublished} />

                    <EditProductForm
                      product={{ id: item.id, description: item.description, images: item.images, name: item.name }}
                    />
                  </div>
                </CardAction>
              )}

              <CardDescription />
            </CardHeader>

            <CardContent className="flex grow flex-col gap-6 whitespace-pre-wrap">
              <ImageSwiper images={item.images} />

              <p>{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
