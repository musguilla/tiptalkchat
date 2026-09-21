import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sala de chat privada - Tiptalk',
  description:
    'Sala de chat privada en tiptalk.chat con texto, voz, vídeo y propinas en directo. Chat con propinas, sin registro ni descargas.',
  robots: { index: false, follow: false },
};

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
