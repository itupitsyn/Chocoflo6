import { ArrowLeft, BookXIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { OrderActions } from '@/components/order/order-actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { statusLabels } from '@/lib/constants/orders';
import { User } from '@/lib/generated/prisma/client';
import { TgUser } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { getOrderSum } from '@/lib/utils/get-order-sum';
import { getServerUserData } from '@/lib/utils/get-server-user-data';
import prisma from '@/prisma/prisma';

const CustomerPage = async (user: TgUser) => {
  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
      status: {
        not: 'CART',
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
          variant: true,
          orderItemOptions: {
            include: {
              option: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <main className="container mt-5 mb-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="pt-2 transition-opacity hover:opacity-70">
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold lg:text-5xl">Мои заказы</h1>
      </div>

      <div className="pt-10">
        {!orders?.length ? (
          <div className="flex h-100 items-center justify-center">
            <div className="flex gap-4 text-4xl font-medium opacity-60">
              <BookXIcon className="mt-2 size-8 flex-none" />У вас пока что нет заказов
            </div>
          </div>
        ) : (
          <div>
            <Table className="w-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Состав</TableHead>
                  <TableHead>Стоимость</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(async (order) => {
                  const price = await getOrderSum(order);

                  return (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.createdAt.toLocaleString('ru-RU')}</TableCell>
                      <TableCell className="max-w-[300px] overflow-hidden text-ellipsis">
                        {order.orderItems.map((item) => item.product.name).join(', ')}
                      </TableCell>
                      <TableCell>{formatPrice(price.toNumber())}</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
};

const AdminPage = async () => {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        not: 'CART',
      },
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
          variant: true,
          orderItemOptions: {
            include: {
              option: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <main className="container mt-5 mb-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="pt-2 transition-opacity hover:opacity-70">
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold lg:text-5xl">Мои заказы</h1>
      </div>

      <div className="pt-10">
        {!orders?.length ? (
          <div className="flex h-100 items-center justify-center">
            <div className="flex gap-4 text-4xl font-medium opacity-60">
              <BookXIcon className="mt-2 size-8 flex-none" />
              Заказов пока что нет
            </div>
          </div>
        ) : (
          <div>
            <Table className="w-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Состав</TableHead>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Стоимость</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(async (order) => {
                  const price = await getOrderSum(order);

                  return (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.createdAt.toLocaleString('ru-RU')}</TableCell>
                      <TableCell className="max-w-[300px] overflow-hidden text-ellipsis">
                        {order.orderItems.map((item) => item.product.name).join(', ')}
                      </TableCell>

                      <TableCell>
                        {order.user.userName ? (
                          <Link href={`https://t.me/${order.user.userName}`} target="_blank">
                            @{order.user.userName}
                          </Link>
                        ) : (
                          `${order.user.name} (${order.userId})`
                        )}
                      </TableCell>
                      <TableCell>{formatPrice(price.toNumber())}</TableCell>
                      <TableCell>{statusLabels[order.status]}</TableCell>
                      <TableCell>
                        <OrderActions orderId={order.id} status={order.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
};

export default async function Page() {
  const { isCustomer, canEdit, user } = await getServerUserData();

  if (!user) {
    notFound();
  }

  if (isCustomer) {
    return CustomerPage(user);
  } else if (canEdit) {
    return AdminPage();
  }

  notFound();
}
