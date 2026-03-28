import { ArrowLeft, BookXIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { OrderItemCount } from '@/components/order/order-item-count';
import { SubmitOrder } from '@/components/order/submit-order';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrentOrder } from '@/lib/data/order';
import { formatPrice } from '@/lib/utils';
import { getServerUserData } from '@/lib/utils/get-server-user-data';

export default async function Page() {
  const { isCustomer, user } = await getServerUserData();

  if (!isCustomer || !user) {
    notFound();
  }

  const order = await getCurrentOrder(user.id);

  return (
    <main className="container mt-5 mb-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="pt-2 transition-opacity hover:opacity-70">
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold lg:text-5xl">Корзина</h1>
      </div>

      <div className="pt-10">
        {!order?.items.length ? (
          <div className="flex h-100 items-center justify-center">
            <div className="flex gap-4 text-4xl font-medium opacity-60">
              <BookXIcon className="mt-2 size-8 flex-none" />
              Корзина пуста
            </div>
          </div>
        ) : (
          <div>
            <Table className="w-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>Продукт</TableHead>
                  <TableHead>Вариант</TableHead>
                  <TableHead>Допы</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead>Стоимость</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => {
                  let price = item.variant.price;
                  item.opts.forEach((opt) => {
                    price = price.add(opt.price);
                  });

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.variant.name}</TableCell>
                      <TableCell className="max-w-[300px] overflow-hidden text-ellipsis">
                        {item.opts.map((item) => item.name).join(', ')}
                      </TableCell>
                      <TableCell>
                        <OrderItemCount count={item.count} id={item.id} />
                      </TableCell>
                      <TableCell>{formatPrice(price.toNumber())}</TableCell>
                    </TableRow>
                  );
                })}

                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell className="text-end font-bold">Итого</TableCell>
                  <TableCell className="font-bold">{formatPrice(order.price.toNumber())}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex justify-end">
              <SubmitOrder orderId={order.id} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
