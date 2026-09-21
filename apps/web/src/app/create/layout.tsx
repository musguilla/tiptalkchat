import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear sala de chat gratis - Tiptalk',
  description:
    'Crea una sala de chat gratis en segundos y comparte el enlace. Chat con propinas por texto, voz y vídeo, sin registro ni descargas: empieza a ganar dinero chateando.',
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
