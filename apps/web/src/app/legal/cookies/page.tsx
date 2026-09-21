import type { Metadata } from 'next';
import { getServerLocale } from '@/i18n/server';
import { getLegalDoc } from '@/lib/legal';
import { LegalArticle } from '@/components/LegalArticle';

export function generateMetadata(): Metadata {
  const doc = getLegalDoc('cookies', getServerLocale());
  return { title: `${doc.title} · tiptalk.chat`, description: 'Política de cookies de tiptalk.chat, la plataforma de chat gratis con propinas para ganar dinero chateando.' };
}

export default function LegalPage() {
  const doc = getLegalDoc('cookies', getServerLocale());
  return <LegalArticle doc={doc} />;
}
