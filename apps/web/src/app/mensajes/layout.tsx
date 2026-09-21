import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mensajes - Tiptalk',
  description:
    'Tu bandeja de mensajes privados en tiptalk.chat. Chatea, responde y recibe propinas con tips en directo en tu chat con propinas.',
  robots: { index: false, follow: false },
};

export default function MensajesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
