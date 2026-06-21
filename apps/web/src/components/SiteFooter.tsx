import Link from 'next/link';
import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Logo className="text-2xl" />
            <p className="mt-3 max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
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

      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400">
          <span>© {new Date().getFullYear()} tiptalk.chat — Todos los derechos reservados.</span>
          <nav className="flex flex-wrap gap-4">
            <Link href="/legal/privacidad" className="hover:text-zinc-900 dark:hover:text-white">
              Política de privacidad
            </Link>
            <Link href="/legal/terminos" className="hover:text-zinc-900 dark:hover:text-white">
              Términos y condiciones
            </Link>
            <Link href="/legal/cookies" className="hover:text-zinc-900 dark:hover:text-white">
              Cookies
            </Link>
            <Link href="/legal/aviso-legal" className="hover:text-zinc-900 dark:hover:text-white">
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
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
        {title}
      </h4>
      <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith('mailto:') || href.startsWith('http');
  if (isExternal) {
    return (
      <li>
        <a href={href} className="hover:text-zinc-900 dark:hover:text-white">
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className="hover:text-zinc-900 dark:hover:text-white">
        {children}
      </Link>
    </li>
  );
}
