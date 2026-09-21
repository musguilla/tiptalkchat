import type { Metadata } from 'next';
import { getServerLocale } from '@/i18n/server';
import { getLegalDoc } from '@/lib/legal';
import { LegalArticle } from '@/components/LegalArticle';

export function generateMetadata(): Metadata {
  const doc = getLegalDoc('privacidad', getServerLocale());
  return { title: `${doc.title} · tiptalk.chat`, description: 'Política de privacidad de tiptalk.chat: qué datos tratamos en tu chat privado con propinas y cómo protegemos tu información.' };
}

export default function LegalPage() {
  const doc = getLegalDoc('privacidad', getServerLocale());
  return <LegalArticle doc={doc} />;
}
