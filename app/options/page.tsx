import { ArrowLeft } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AddOptionForm } from '@/components/option/add-option-form';
import { DeleteOptionButton } from '@/components/option/delete-option-button';
import { EditOptionForm } from '@/components/option/edit-option-form';
import { ImageSwiper } from '@/components/product/image-swiper';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TG_COOKIES } from '@/lib/constants/cookies';
import { cn, formatPrice, isAdmin } from '@/lib/utils';
import prisma from '@/prisma/prisma';

export default async function Page() {
  const cks = await cookies();
  const initData = cks.get(TG_COOKIES)?.value;
  const canEdit = isAdmin(initData);

  if (!canEdit) {
    notFound();
  }

  const data = await prisma.option.findMany({
    where: {
      deletedAt: null,
    },
  });

  return (
    <main className="container mt-5 mb-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="pt-2 transition-opacity hover:opacity-70">
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold lg:text-5xl">Дополнения</h1>

        <div className="ml-auto">
          <AddOptionForm />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 pt-10">
        {data.map((item, idx, list) => (
          <Card key={item.id} className={cn(list.length < 2 && 'max-w-1/2')}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>

              <CardAction>
                <div className="flex gap-2">
                  <DeleteOptionButton id={item.id} />

                  {/* <ChangeProductVisibilityButton id={item.id} isPublished={item.isPublished} /> */}
                  <EditOptionForm option={{ ...item, price: item.price.toNumber() }} />
                </div>
              </CardAction>

              <CardDescription>{formatPrice(item.price.toNumber())}</CardDescription>
            </CardHeader>

            <CardContent className="flex grow flex-col gap-6 whitespace-pre-wrap">
              <ImageSwiper images={item.images} />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
