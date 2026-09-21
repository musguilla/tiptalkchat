import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monedero y retiradas - Tiptalk',
  description:
    'Consulta tu monedero, revisa tus propinas y retira en euros lo que ganas. Así de fácil es ganar dinero chat en tiptalk.chat, tu chat con propinas.',
  robots: { index: false, follow: false },
};

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
