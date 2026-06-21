import Link from 'next/link';
import {
  MessageCircle,
  Link2,
  PhoneCall,
  Coins,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { t } from '@/i18n';
import { Logo } from '@/components/Logo';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 -top-32 -z-10 h-[420px] bg-[radial-gradient(closest-side,rgba(255,92,0,0.18),transparent)]" />
        <div className="absolute right-0 top-20 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,0,122,0.18),transparent)]" />
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:py-32">
          <div className="text-center">
            <div className="label-mono inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-primary-700">
              <Sparkles className="h-3.5 w-3.5" />
              Sin instalaciones · Solo un enlace
            </div>
            <Logo className="mt-8 text-6xl sm:text-8xl lg:text-9xl" />
            <h1 className="mx-auto mt-10 max-w-3xl font-display text-[44px] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {t('es', 'landing.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl">
              {t('es', 'landing.subtitle')}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/create"
                className="btn-tactile rounded-md bg-primary-500 px-8 py-3.5 text-base font-semibold text-white shadow-vivid transition hover:bg-primary-600 hover:shadow-vivid-strong"
              >
                {t('es', 'landing.cta.create')}
              </Link>
              <Link
                href="/login"
                className="btn-tactile rounded-md border-2 border-primary-500 bg-white px-8 py-3 text-base font-semibold text-primary-500 transition hover:bg-primary-50"
              >
                {t('es', 'auth.login')}
              </Link>
            </div>
            <p className="label-mono mt-8 text-ink-soft">
              Gratis · Sin tarjeta · Sin instalar nada
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="caracteristicas" className="border-t border-surface-container bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="label-mono text-primary-500">Características</span>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Todo para un chat privado
            </h2>
            <p className="mt-5 text-lg text-ink-muted">
              Pensado para conversaciones uno a uno con opciones simples para los anfitriones.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<Link2 className="h-6 w-6" />}
              title="URLs cortas"
              body="Tu sala tiene un enlace amigable que puedes compartir por WhatsApp, mail o donde quieras."
            />
            <Feature
              icon={<MessageCircle className="h-6 w-6" />}
              title="Chat en directo"
              body="Texto, fotos y vídeos en tiempo real. Sin app, abre el enlace y dentro."
            />
            <Feature
              icon={<PhoneCall className="h-6 w-6" />}
              title="Llamadas y vídeo"
              body="Voz y vídeo de alta calidad integrados, con un clic dentro de la sala."
            />
            <Feature
              icon={<Coins className="h-6 w-6" />}
              title="Recibe propinas"
              body="Tus invitados pueden enviarte propinas en € desde el primer minuto."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="bg-surface-soft py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="label-mono text-secondary-500">Cómo funciona</span>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              En menos de un minuto
            </h2>
            <p className="mt-5 text-lg text-ink-muted">
              Crea, comparte, conversa. Así de fácil.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Step
              n={1}
              title="Crea tu sala"
              body="Le pones un nombre y, si quieres, un PIN. Te damos un enlace corto al instante."
            />
            <Step
              n={2}
              title="Comparte el enlace"
              body="WhatsApp, email, redes... cualquiera puede entrar con solo abrir tu URL."
            />
            <Step
              n={3}
              title="Chatea y recibe propinas"
              body="Tus invitados envían mensajes, llamadas y propinas en €. Tú decides cuándo cerrar."
            />
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-surface-container bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <TrustCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Privado por diseño"
              body="Tus chats se cierran y borran tras 24 horas, o cuando lo decidas. Nada queda guardado."
            />
            <TrustCard
              icon={<Smartphone className="h-5 w-5" />}
              title="Funciona en todas partes"
              body="Web responsive. Apps móviles en camino. Sin instalaciones para tus invitados."
            />
            <TrustCard
              icon={<Coins className="h-5 w-5" />}
              title="Cobros sencillos"
              body="A partir de 30€ acumulados puedes solicitar el cobro a tu cuenta bancaria."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-secondary-500 to-primary-500 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Empieza tu primera sala
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Sin instalar nada. Sin tarjeta. Cierra cuando quieras.
          </p>
          <Link
            href="/create"
            className="btn-tactile mt-10 inline-block rounded-md bg-white px-10 py-4 text-base font-bold text-primary-500 shadow-vivid-strong transition hover:bg-canvas"
          >
            Crear una sala gratis
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="group rounded-lg border border-surface-container bg-white p-7 shadow-soft transition hover:border-primary-200 hover:shadow-vivid">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-50 text-primary-500 transition group-hover:bg-primary-500 group-hover:text-white">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="relative rounded-lg bg-white p-8 shadow-card">
      <div className="absolute -top-5 left-7 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 font-display text-base font-extrabold text-white shadow-vivid">
        {n}
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}

function TrustCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-secondary-50 text-secondary-500">
        {icon}
      </div>
      <div>
        <h4 className="font-display text-base font-bold text-ink">{title}</h4>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{body}</p>
      </div>
    </div>
  );
}
