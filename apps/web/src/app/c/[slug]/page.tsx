import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { type SeoPage } from '@/lib/seo-pages';
import { getSeoPage, hasSeoCatalog } from '@/lib/seo-i18n';
import { getServerLocale } from '@/i18n/server';
import { t } from '@/i18n';
import { localizeHref } from '@/i18n/routing';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/config';

// Rendered per request so the middleware's x-locale header is read at
// request time. With generateStaticParams these pages were prerendered once
// in Spanish and served that way for every locale (/zh/c/…, /hi/c/… all ES).
export const dynamic = 'force-dynamic';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tiptalk.chat').replace(/\/$/, '');

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const locale = getServerLocale();
  const page = getSeoPage(params.slug, locale);
  if (!page) return {};

  // hreflang: the Spanish canonical + every locale that has translated content.
  const languages: Record<string, string> = {
    [DEFAULT_LOCALE]: `${SITE}/c/${page.slug}`,
  };
  for (const loc of LOCALES) {
    if (loc !== DEFAULT_LOCALE && hasSeoCatalog(loc)) {
      languages[loc] = `${SITE}${localizeHref(`/c/${page.slug}`, loc)}`;
    }
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `${SITE}${localizeHref(`/c/${page.slug}`, locale)}`,
      languages,
    },
    openGraph: { title: page.metaTitle, description: page.metaDescription, type: 'website' },
  };
}

/** Render **bold** segments inside a paragraph string. */
function renderMarkdown(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function faqSchema(page: SeoPage): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });
}

export default function SeoLandingPage({ params }: { params: { slug: string } }) {
  const locale = getServerLocale();
  const page = getSeoPage(params.slug, locale);
  if (!page) notFound();
  const createHref = localizeHref('/create', locale);

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema(page) }} />

      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
        <div className="mb-10 flex flex-col items-start gap-4 rounded-xl border border-primary-200 bg-primary-50/70 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-base font-bold text-primary-700">
              {t(locale, 'seo.cta.top.title')}
            </p>
            <p className="text-sm text-primary-700/80">{t(locale, 'seo.cta.top.sub')}</p>
          </div>
          <Link
            href={createHref}
            className="btn-tactile inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-vivid hover:shadow-vivid-strong"
          >
            {t(locale, 'home.hero.cta')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{page.h1}</h1>

        <p className="mt-4 text-lg leading-relaxed text-ink">{renderMarkdown(page.intro)}</p>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-muted">
          {page.paragraphs.map((p, i) => (
            <p key={i}>{renderMarkdown(p)}</p>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t(locale, 'seo.faq.title')}
          </h2>
          <div className="mt-6 divide-y divide-surface-container rounded-xl border border-surface-container bg-white shadow-soft">
            {page.faqs.map((faq, i) => (
              <details key={i} className="group p-5" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-base font-bold text-ink">
                  <span>{faq.q}</span>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-500 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-14 rounded-xl border border-surface-container bg-white p-7 text-center shadow-soft">
          <p className="font-display text-lg font-bold">{t(locale, 'seo.cta.bottom.title')}</p>
          <p className="mt-1 text-sm text-ink-muted">{t(locale, 'seo.cta.bottom.sub')}</p>
          <Link
            href={createHref}
            className="btn-tactile mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-6 py-3 text-sm font-bold text-white shadow-vivid hover:shadow-vivid-strong"
          >
            {t(locale, 'home.hero.cta')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
