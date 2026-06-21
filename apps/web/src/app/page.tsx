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
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900" />
        <div className="absolute inset-x-0 -top-10 -z-10 h-72 bg-[radial-gradient(closest-side,rgba(249,115,22,0.18),transparent)] dark:bg-[radial-gradient(closest-side,rgba(249,115,22,0.12),transparent)]" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28 lg:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/40 dark:text-orange-300">
            <Sparkles className="h-3.5 w-3.5" />
            Sin instalaciones · Comparte un enlace y ya
          </div>
          <Logo className="mt-6 text-5xl sm:text-7xl lg:text-8xl" />
          <h1 className="mx-auto mt-8 max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
            {t('es', 'landing.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl dark:text-zinc-400">
            {t('es', 'landing.subtitle')}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/create"
              className="rounded-lg bg-orange-500 px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg"
            >
              {t('es', 'landing.cta.create')}
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-zinc-300 bg-white px-8 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              {t('es', 'auth.login')}
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-500">Gratis para empezar · Sin tarjeta · Sin instalar nada</p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="caracteristicas" className="border-t border-zinc-100 bg-white py-20 dark:border-zinc-900 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              Todo lo que necesitas para un chat privado
            </h2>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
              Pensado para conversaciones uno a uno, con opciones simples para los anfitriones.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <section id="como-funciona" className="bg-zinc-50 py-20 dark:bg-zinc-900/60">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              Cómo funciona
            </h2>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
              En menos de un minuto tienes tu sala lista y compartida.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
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
      <section className="border-t border-zinc-100 bg-white py-16 dark:border-zinc-900 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
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
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-500 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Empieza tu primera sala ahora
          </h2>
          <p className="mt-3 text-lg text-white/90">
            Sin instalar nada. Sin tarjeta. Cierra cuando quieras.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3.5 text-base font-bold text-orange-600 shadow-lg transition hover:bg-zinc-50"
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
    <div className="rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-orange-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-900/40">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="relative rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900">
      <div className="absolute -top-4 left-6 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-base font-bold text-white shadow">
        {n}
      </div>
      <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{body}</p>
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
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{body}</p>
      </div>
    </div>
  );
}
