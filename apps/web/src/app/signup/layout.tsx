import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear cuenta gratis - Tiptalk',
  description:
    'Regístrate gratis en tiptalk.chat y empieza a ganar dinero chateando: chat con propinas por texto, voz y vídeo, con tips en directo y retiradas en euros.',
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
