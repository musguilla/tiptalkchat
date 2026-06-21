import Link from 'next/link';
import { Globe, X as XIcon } from 'lucide-react';
import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <footer className="bg-canvas">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <Logo className="text-2xl" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              La plataforma líder para monetizar conexiones privadas 1-on-1.
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
            <FooterLink href="#como-funciona">How it Works</FooterLink>
            <FooterLink href="#caracteristicas">Features</FooterLink>
            <FooterLink href="#precios">Pricing</FooterLink>
          </FooterColumn>

          <FooterColumn title="Legal">
            <FooterLink href="/legal/terminos">Terms of Service</FooterLink>
            <FooterLink href="/legal/privacidad">Privacy Policy</FooterLink>
            <FooterLink href="/legal/aviso-legal">Creator Guidelines</FooterLink>
          </FooterColumn>

          <FooterColumn title="Soporte">
            <FooterLink href="mailto:hola@tiptalk.chat">Support</FooterLink>
            <FooterLink href="/ayuda">Help Center</FooterLink>
            <FooterLink href="/contacto">Contact Us</FooterLink>
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-surface-container">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-ink-muted">
          <span>© {new Date().getFullYear()} TipTalk. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Made with <span className="text-secondary-500">❤</span> for Creators
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
