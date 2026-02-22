import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/lib/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Наполняем витрину сладостями, заюш... 🍬✨');

  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.create({
    data: {
      name: 'Набор авторских трюфелей',
      description:
        'Бельгийский шоколад, натуральные сливки и щепотка магии. Вкусы: классик, соленая карамель, дорблю-грецкий орех.',
      images: ['1.jpg', '2.jpg'],
      isPublished: true,
      variants: {
        create: [
          { name: 'Набор 9 шт', price: 1200 },
          { name: 'Набор 16 шт', price: 1950 },
          { name: 'Подарочный бокс (25 шт)', price: 2800 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Бенто-торт "Для тебя"',
      description:
        'Маленький торт для большого праздника. Начинка на выбор: ваниль-клубника или шоколад-вишня. Надпись можно изменить!',
      images: ['3.jpg', '4.jpg'],
      isPublished: true,
      variants: {
        create: [
          { name: 'Вес 450г (стандарт)', price: 1500 },
          { name: 'Вес 700г (Maxi)', price: 2100 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Макаронс в ассортименте',
      description: 'Французская классика на миндальной муке. Укажите желаемые вкусы в комментарии к заказу.',
      images: ['5.jpg', '6.jpg'],
      isPublished: true,
      variants: {
        create: [
          { name: 'Штучно (от 5 шт)', price: 180 },
          { name: 'Коробочка 10 шт', price: 1700 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Вкусническое',
      description: 'Очень вкуснические штучки! Берём скорее, не стесняемся!',
      images: ['7.jpg', '8.jpg'],
      isPublished: true,
      variants: {
        create: [
          { name: 'Штучно (от 5 шт)', price: 180 },
          { name: 'Коробочка 10 шт', price: 1700 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Вкусническое',
      description: 'Очень вкуснические штучки! Берём скорее, не стесняемся!',
      images: [],
      isPublished: true,
      variants: {
        create: [
          { name: 'Штучно (от 5 шт)', price: 180 },
          { name: 'Коробочка 10 шт', price: 1700 },
        ],
      },
    },
  });

  console.log('Витрина готова! Теперь это настоящий Candy Shop. 🍫');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
