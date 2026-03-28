import { TgUser } from '../types';

export function notifyAdmin(orderId: number, amount: number, user: TgUser) {
  const userParts: string[] = [];
  if (user.first_name) {
    userParts.push(user.first_name);
  }
  if (user.last_name) {
    userParts.push(user.last_name);
  }
  const message = `🍓 <b>Заказ №${orderId}</b>\nНа сумму: <code>${amount}</code> руб.\nОт:${user.username ? `@${user.username}` : `<a href="tg://user?id=${user.id}">${userParts.join(' ') || 'user'}</a>`}`;

  void fetch(`https://api.telegram.org/bot${Bun.env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: Bun.env.ADMIN_ID, text: message, parse_mode: 'HTML' }),
  });
}
