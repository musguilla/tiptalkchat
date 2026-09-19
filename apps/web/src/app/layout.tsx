import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthBoot } from '@/components/AuthBoot';
import { getServerLocale, getServerDir } from '@/i18n/server';

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Salas chat privadas con propinas - Tiptalk',
  description:
    'Crea una sala de chat privada, comparte el enlace y recibe propinas en directo. Chat, voz y vídeo en tiptalk.chat. Sin registro, sin instalar nada.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getServerLocale();
  return (
    <html
      lang={locale}
      dir={getServerDir(locale)}
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="bg-canvas font-body text-ink antialiased">
        <AuthBoot />
        {children}
      </body>
    </html>
  );
}
