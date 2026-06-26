import Link from 'next/link';
import { Globe, X as XIcon } from 'lucide-react';
import { Logo } from './Logo';
import { seoFooterColumns, seoPageMap } from '@/lib/seo-pages';

export function SiteFooter() {
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
                        <Link
                          href={`/c/${slug}`}
                          className="transition hover:text-primary-500"
                        >
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
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              Salas de chats privadas con tips.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="Sitio web"
                className="grid h-8 w-8 place-items-center rounded-full bg-surface-container text-ink-muted transition hover:bg-primary-50 hover:text-primary-500"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="X / Twitter"
                className="grid h-8 w-8 place-items-center rounded-full bg-surface-container text-ink-muted transition hover:bg-primary-50 hover:text-primary-500"
              >
                <XIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterColumn title="Plataforma">
            <FooterLink href="/create">Crear chat</FooterLink>
            <FooterLink href="#como-funciona">Cómo funciona</FooterLink>
            <FooterLink href="#caracteristicas">Características</FooterLink>
          </FooterColumn>

          <FooterColumn title="Legal">
            <FooterLink href="/legal/terminos">Términos del servicio</FooterLink>
            <FooterLink href="/legal/privacidad">Política de privacidad</FooterLink>
            <FooterLink href="/legal/aviso-legal">Guía para creadores</FooterLink>
          </FooterColumn>

          <FooterColumn title="Soporte">
            <FooterLink href="/contacto">Contacto</FooterLink>
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-surface-container">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-ink-muted">
          <span>© {new Date().getFullYear()} tiptalk.chat — Todos los derechos reservados.</span>
          <span className="flex items-center gap-1">
            Hecho con <span className="text-secondary-500">❤</span> para creadores
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-bold text-ink">{title}</h4>
      <ul className="space-y-2.5 text-sm text-ink-muted">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith('mailto:') || href.startsWith('http') || href.startsWith('#');
  if (isExternal) {
    return (
      <li>
        <a href={href} className="transition hover:text-primary-500">
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className="transition hover:text-primary-500">
        {children}
      </Link>
    </li>
  );
}
