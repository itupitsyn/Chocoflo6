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
      name: '🗓 Клубника в шоколаде! 🌟',
      description: `Сделайте выбор в пользу элегантности и вкуса! Пусть ваша вторая половинка почувствует всю глубину ваших чувств с каждой ягодкой нашей клубники в шоколаде. 

❤️ Закажите нашу клубнику в шоколаде уже сегодня, количество наборов ограничено!

🍓 Клубника в шоколаде 
9 шт - 1700 рублей
12шт - 2300 рублей
15шт - 2800 рублей
16шт - 2950 рублей
20шт - 3800 рублей
24шт - 4500 рублей
(ГМ) Сердце грани маленькое (260гр) (20*20см)- 2600 рублей 
(СМ) Сердце среднее (420гр) (24*21см) - 3300 рублей
(СБ) Сердце большое (700гр) (30*29см) - 4200 рублей

Декор:
Свежая голубика - 200 рублей
Шоколадная надпись/мишка с сердцем - 200 рублей`,
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

  await prisma.product.create({
    data: {
      name: '🍇Виноград в шоколаде',
      description:
        '🍇Виноград в шоколаде —  изысканное лакомство, сочетающее свежесть ягод и насыщенный вкус шоколада. Нежные виноградинки покрыты тонким слоем ароматного шоколада, создавая гармоничный баланс вкусов.  Виноград в шоколаде станет отличным дополнением к любому мероприятию, добавив нотку роскоши и утонченности.',
      images: ['9.jpg', '10.jpg', '11.jpg'],
      isPublished: true,
      variants: {
        create: [
          { name: 'Сердце грани (20*20см)', price: 5000 },
          { name: 'Сердце с розами (30*29см)', price: 7000 },
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
