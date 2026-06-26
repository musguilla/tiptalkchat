import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { seoPageMap, seoSlugs } from '@/lib/seo-pages';

export function generateStaticParams(): Array<{ slug: string }> {
  return seoSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = seoPageMap[params.slug];
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `/c/${page.slug}`,
    },
  };
}

export default function SeoLandingPage({ params }: { params: { slug: string } }) {
  const page = seoPageMap[params.slug];
  if (!page) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
        {/* Top CTA — this is the conversion point we want above the fold. */}
        <div className="mb-10 flex flex-col items-start gap-4 rounded-xl border border-primary-200 bg-primary-50/70 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-base font-bold text-primary-700">
              Abre tu sala en menos de un minuto
            </p>
            <p className="text-sm text-primary-700/80">
              Sin registro. Pon un nick, un nombre y comparte el enlace.
            </p>
          </div>
          <Link
            href="/create"
            className="btn-tactile inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-vivid hover:shadow-vivid-strong"
          >
            Crear sala de chat
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          {page.h1}
        </h1>

        <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-muted">
          {page.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        {/* Bottom CTA repeat — natural second exit point. */}
        <div className="mt-12 rounded-xl border border-surface-container bg-white p-6 text-center shadow-soft">
          <p className="font-display text-lg font-bold">¿Listo para empezar?</p>
          <p className="mt-1 text-sm text-ink-muted">
            Tarda menos que leer este párrafo otra vez.
          </p>
          <Link
            href="/create"
            className="btn-tactile mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-6 py-3 text-sm font-bold text-white shadow-vivid hover:shadow-vivid-strong"
          >
            Crear sala de chat
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
