import { headers } from 'next/headers';

export const getRequestOrigin = async () => {
  const headersData = await headers();
  const host = headersData.get('host');
  const protocol =
    (headersData.get('x-forwarded-proto') ?? host?.startsWith('localhost'))
      ? 'http'
      : 'https';
  return `${protocol}://${host}`;
};
