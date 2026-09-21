'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { seoFooterColumns, seoPageMap } from '@/lib/seo-pages';
import { getSeoFooterLabel } from '@/lib/seo-i18n';
import { useLocale, useT, localizeHref, stripLocale } from '@/i18n/useLocale';
import { LOCALES, LOCALE_FLAGS, LOCALE_NAMES, DEFAULT_LOCALE } from '@/i18n/config';

export function SiteFooter() {
  const locale = useLocale();
  const t = useT();
  const L = (href: string): string => localizeHref(href, locale);
  const pathname = usePathname() || '/';
  const base = stripLocale(pathname);

  return (
    <footer className="bg-canvas">
      {/* SEO link grid — above legal so crawlers find it on every page. */}
      <div className="border-t border-surface-container">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {seoFooterColumns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-muted">
                  {t(col.titleKey)}
                </h4>
                <ul className="space-y-1.5 text-sm text-ink">
                  {col.slugs.map((slug) => {
                    const page = seoPageMap[slug];
                    if (!page) return null;
                    return (
                      <li key={slug}>
                        <Link href={L(`/c/${slug}`)} className="transition hover:text-primary-500">
                          {getSeoFooterLabel(slug, locale)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <Logo className="text-2xl" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {t('footer.tagline')}{' '}
              <Link
                href={L('/ganar-dinero')}
                className="font-semibold text-primary-600 underline decoration-primary-300 underline-offset-2 transition hover:text-primary-500"
              >
                {t('footer.earnCta')}
              </Link>
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-ink">{t('footer.col.platform')}</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li><Link href={L('/create')} className="transition hover:text-primary-500">{t('footer.link.createChat')}</Link></li>
              <li><a href="#como-funciona" className="transition hover:text-primary-500">{t('footer.link.howItWorks')}</a></li>
              <li><a href="#caracteristicas" className="transition hover:text-primary-500">{t('footer.link.features')}</a></li>
              <li><Link href={L('/contacto')} className="transition hover:text-primary-500">{t('footer.link.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-ink">{t('footer.col.legal')}</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li><Link href={L('/legal/terminos')} className="transition hover:text-primary-500">{t('footer.link.terms')}</Link></li>
              <li><Link href={L('/legal/privacidad')} className="transition hover:text-primary-500">{t('footer.link.privacy')}</Link></li>
              <li><Link href={L('/legal/aviso-legal')} className="transition hover:text-primary-500">{t('footer.link.creators')}</Link></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-surface-container">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">{t('footer.languages')}</h4>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {LOCALES.map((l) => {
              const href = l === DEFAULT_LOCALE ? base : localizeHref(base, l);
              const active = l === locale;
              return (
                <li key={l}>
                  {/* Plain <a> (full reload) so server-rendered text re-renders
                      in the new locale — a client <Link> nav would leave the
                      cached RSC (and its language) in place. */}
                  <a
                    href={href}
                    hrefLang={l}
                    className={`flex items-center gap-2 transition hover:text-primary-500 ${
                      active ? 'font-semibold text-primary-600' : 'text-ink-muted'
                    }`}
                  >
                    <span className="text-base">{LOCALE_FLAGS[l]}</span>
                    <span>{LOCALE_NAMES[l]}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-container">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-ink-muted">
          <span>© {new Date().getFullYear()} tiptalk.chat — {t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  );
}
