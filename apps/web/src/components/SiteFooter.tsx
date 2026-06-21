import Link from 'next/link';
import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <footer className="border-t border-surface-container bg-surface-soft">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Logo className="text-2xl" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
              Salas privadas para conversaciones uno a uno. Comparte el enlace, chatea y recibe propinas.
            </p>
          </div>

          <FooterColumn title="Producto">
            <FooterLink href="/create">Crear sala</FooterLink>
            <FooterLink href="/login">Iniciar sesión</FooterLink>
            <FooterLink href="/signup">Crear cuenta</FooterLink>
            <FooterLink href="/#como-funciona">Cómo funciona</FooterLink>
          </FooterColumn>

          <FooterColumn title="Empresa">
            <FooterLink href="/sobre">Sobre nosotros</FooterLink>
            <FooterLink href="/contacto">Contacto</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
          </FooterColumn>

          <FooterColumn title="Soporte">
            <FooterLink href="/ayuda">Centro de ayuda</FooterLink>
            <FooterLink href="/faq">Preguntas frecuentes</FooterLink>
            <FooterLink href="mailto:hola@tiptalk.chat">hola@tiptalk.chat</FooterLink>
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-surface-container">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-ink-muted">
          <span className="label-mono">© {new Date().getFullYear()} tiptalk.chat</span>
          <nav className="flex flex-wrap gap-5">
            <Link href="/legal/privacidad" className="transition hover:text-ink">
              Política de privacidad
            </Link>
            <Link href="/legal/terminos" className="transition hover:text-ink">
              Términos y condiciones
            </Link>
            <Link href="/legal/cookies" className="transition hover:text-ink">
              Cookies
            </Link>
            <Link href="/legal/aviso-legal" className="transition hover:text-ink">
              Aviso legal
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="label-mono mb-4 text-ink">{title}</h4>
      <ul className="space-y-2.5 text-sm text-ink-muted">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith('mailto:') || href.startsWith('http');
  if (isExternal) {
    return (
      <li>
        <a href={href} className="transition hover:text-ink">
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className="transition hover:text-ink">
        {children}
      </Link>
    </li>
  );
}
