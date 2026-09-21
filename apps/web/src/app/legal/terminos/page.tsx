import type { Metadata } from 'next';
import { getServerLocale } from '@/i18n/server';
import { getLegalDoc } from '@/lib/legal';
import { LegalArticle } from '@/components/LegalArticle';

export function generateMetadata(): Metadata {
  const doc = getLegalDoc('terminos', getServerLocale());
  return { title: `${doc.title} · tiptalk.chat`, description: 'Términos del servicio de tiptalk.chat: normas de uso del chat con propinas, cuentas, tips y retiradas para ganar dinero chateando.' };
}

export default function LegalPage() {
  const doc = getLegalDoc('terminos', getServerLocale());
  return <LegalArticle doc={doc} />;
}
