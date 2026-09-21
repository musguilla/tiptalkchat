import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto - Tiptalk',
  description:
    '¿Dudas o sugerencias? Contacta con el equipo de tiptalk.chat, tu chat gratis con propinas para ganar dinero chateando.',
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
