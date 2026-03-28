import { TgUser } from '../types';
import { OrderData } from '../types/order';
import { formatPrice } from './format-price';
import { getOrderItemSum, getOrderSum } from './get-order-sum';

export const notifyAdmin = async (order: OrderData, user: TgUser) => {
  const userParts: string[] = [];
  if (user.first_name) {
    userParts.push(user.first_name);
  }
  if (user.last_name) {
    userParts.push(user.last_name);
  }

  const amount = await getOrderSum(order);

  const userName = user.username
    ? `@${user.username}`
    : `<a href="tg://user?id=${user.id}">${userParts.join(' ') || 'user'}</a>`;

  let message = `🍓 <b>Заказ №${order.id}</b>\nНа сумму: <code>${amount}</code> руб.\nОт:${userName}\n`;

  await order.orderItems.forEach(async (item) => {
    const itemTotal = await getOrderItemSum(item);

    message += `<code>${item.product.name} — ${item.variant.name} x${item.count} ${formatPrice(itemTotal.toNumber())}</code>\n`;

    if (item.orderItemOptions.length > 0) {
      item.orderItemOptions.forEach((opt) => {
        message += `<i>  └ ${opt.option.name}</i>\n`;
      });
    }
  });

  void fetch(`https://api.telegram.org/bot${Bun.env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: Bun.env.ADMIN_ID, text: message, parse_mode: 'HTML' }),
  });
};
