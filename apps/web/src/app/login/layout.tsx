import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar sesión - Tiptalk',
  description:
    'Inicia sesión en tiptalk.chat para gestionar tus salas de chat con propinas, tus tips y tus retiradas para ganar dinero chateando.',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
