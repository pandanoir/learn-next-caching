import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Learn next.js caching',
  description: 'next.jsの各キャッシュについて実際にコードを書いて学ぶ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
