export async function verifyTelegramAuth(initData: string): Promise<boolean> {
  const botToken = process.env['BOT_TOKEN'];
  const decodedData = decodeURIComponent(initData);
  const urlParams = new URLSearchParams(decodedData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  if (!hash) return false;

  const dataCheckString = Array.from(urlParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');

  const encoder = new TextEncoder();

  const secretKeyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode('WebAppData'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const hmacKeyBuffer = await crypto.subtle.sign('HMAC', secretKeyMaterial, encoder.encode(botToken));

  const hmacKey = await crypto.subtle.importKey('raw', hmacKeyBuffer, { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);

  const signatureBuffer = await crypto.subtle.sign('HMAC', hmacKey, encoder.encode(dataCheckString));

  const calculatedHash = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return calculatedHash === hash;
}
