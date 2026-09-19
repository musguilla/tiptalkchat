'use client';
import Link from 'next/link';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { seoFooterColumns, seoPageMap } from '@/lib/seo-pages';
import { useLocale, useT, localizeHref } from '@/i18n/useLocale';

export function SiteFooter() {
  const locale = useLocale();
  const t = useT();
  const L = (href: string): string => localizeHref(href, locale);

  return (
    <footer className="bg-canvas">
      {/* SEO link grid — above legal so crawlers find it on every page. */}
      <div className="border-t border-surface-container">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {seoFooterColumns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-muted">
                  {col.title}
                </h4>
                <ul className="space-y-1.5 text-sm text-ink">
                  {col.slugs.map((slug) => {
                    const page = seoPageMap[slug];
                    if (!page) return null;
                    return (
                      <li key={slug}>
                        <Link href={L(`/c/${slug}`)} className="transition hover:text-primary-500">
                          {page.label}
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
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">{t('footer.tagline')}</p>
            <div className="mt-5">
              <LanguageSwitcher />
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-ink">{t('footer.col.platform')}</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li><Link href={L('/create')} className="transition hover:text-primary-500">{t('footer.link.createChat')}</Link></li>
              <li><a href="#como-funciona" className="transition hover:text-primary-500">{t('footer.link.howItWorks')}</a></li>
              <li><a href="#caracteristicas" className="transition hover:text-primary-500">{t('footer.link.features')}</a></li>
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

          <div>
            <h4 className="mb-4 text-sm font-bold text-ink">{t('footer.col.support')}</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li><Link href={L('/contacto')} className="transition hover:text-primary-500">{t('footer.link.contact')}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-container">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-ink-muted">
          <span>© {new Date().getFullYear()} tiptalk.chat — {t('footer.rights')}</span>
          <span>{t('footer.madeWith')}</span>
        </div>
      </div>
    </footer>
  );
}
