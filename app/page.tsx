import { ImageSwiper } from '@/components/image-swiper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/utils/prisma';

export default async function Page() {
  const data = await prisma.product.findMany({
    include: {
      variants: true,
    },
    where: {
      isPublished: true,
    },
  });

  return (
    <main className="container">
      <h1 className="mt-10 text-5xl font-bold">Chocoflo6</h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 pt-10">
        {data.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription />
            </CardHeader>
            <CardContent className="whitespace-pre-wrap">
              <ImageSwiper images={item.images} />
              {/* <div className="grid grid-cols-2 gap-4">
                {item.images.map((img) => {
                  const src = getImageUrl(img);
                  if (!src) {
                    return null;
                  }
                  return (
                    <div key={img} className="relative h-50 w-50">
                      <Image fill sizes="(max-width: 768px) 100vw, 33vw" src={src} alt="" className="object-cover" />
                    </div>
                  );
                })}
              </div> */}

              <p className="pt-6">{item.description}</p>
            </CardContent>
            <CardFooter className="flex grow items-end justify-end">
              <Button>Заказать</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
