import Link from 'next/link';
import {
  Lock,
  Share2,
  MessageCircle,
  Video,
  ShieldCheck,
  CreditCard,
  Zap,
  ArrowRight,
  Mic,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { HeroVideoPreview } from '@/components/HeroVideoPreview';
import { LiveRoomsBadge } from '@/components/LiveRoomsBadge';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-32 -top-20 -z-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(255,92,0,0.18),transparent_70%)]" />
        <div className="absolute -left-32 top-40 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(255,0,122,0.12),transparent_70%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* LEFT */}
          <div>
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Salas de chats <span className="text-primary-500">privadas</span> 1 a 1
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
              Chatea con quien quieras con videollamada, voz o solo texto.
            </p>
            <div className="mt-10">
              <Link
                href="/create"
                className="btn-tactile inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-12 py-5 text-lg font-bold text-white shadow-vivid transition hover:shadow-vivid-strong sm:w-auto sm:min-w-[20rem]"
              >
                Crear sala de chat
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <HeroVideoPreview />
          </div>
        </div>
      </section>

      {/* LIVE COUNTER */}
      <section className="border-y border-surface-container bg-surface-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-6">
          <LiveRoomsBadge />
        </div>
      </section>

      {/* EMPIEZA EN MINUTOS */}
      <section id="como-funciona" className="bg-canvas py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Empieza a chatear
            </h2>
            <p className="mt-4 text-base text-ink-muted">
              Lo tienes a 2 clicks.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <StepCard
              color="bg-primary-500"
              icon={<Lock className="h-5 w-5" />}
              title="Crea tu sala privada"
              body="Dale un nombre y listo!"
            />
            <StepCard
              color="bg-secondary-500"
              icon={<Share2 className="h-5 w-5" />}
              title="Comparte tu enlace"
              body="Comparte tu enlace con quien tu quieras."
            />
            <StepCard
              color="bg-blue-500"
              icon={<MessageCircle className="h-5 w-5" />}
              title="Empieza a chatear"
              body="Chat de voz y video con sistema de propinas integrado."
            />
          </div>
        </div>
      </section>

      {/* TECNOLOGÍA DE ÉLITE */}
      <section id="caracteristicas" className="bg-canvas py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <FeaturePill icon={<Video className="h-4 w-4" />} title="HD Video" sub="Calidad premium garantizada." />
            <FeaturePill icon={<Lock className="h-4 w-4" />} title="Privacidad" sub="Encriptación de punta a punta." />
            <FeaturePill icon={<ShieldCheck className="h-4 w-4" />} title="Pagos Seguros" sub="Protección contra fraudes." />
            <FeaturePill icon={<Zap className="h-4 w-4" />} title="Instantáneo" sub="Cerca de tus seguidores." />
          </div>
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Tecnología de élite para creadores premium
            </h2>
            <div className="mt-10 space-y-7">
              <FeatureItem
                icon={<Mic className="h-5 w-5" />}
                color="bg-primary-50 text-primary-500"
                title="Voz y Video de Alta Calidad"
                body="Experimenta una conexión sin latencia. La mejor tecnología WebRTC para tus sesiones más importantes."
              />
              <FeatureItem
                icon={<CreditCard className="h-5 w-5" />}
                color="bg-secondary-50 text-secondary-500"
                title="Sistema de Propinas Seguro"
                body="Tus ingresos están protegidos. Integramos los procesadores de pago más confiables del mundo."
              />
              <FeatureItem
                icon={<ShieldCheck className="h-5 w-5" />}
                color="bg-blue-50 text-blue-500"
                title="Privacidad por Diseño"
                body="Tú tienes el control total. No guardamos grabaciones y tus datos personales son sagrados."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA LAVENDER */}
      <section id="precios" className="px-6 pb-20">
        <div className="mx-auto max-w-5xl rounded-xl bg-surface-container px-6 py-16 text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            ¿Listo para empezar?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-ink-muted">
            Únete a los miles de creadores que están transformando su comunidad en una fuente de
            ingresos real.
          </p>
          <Link
            href="/create"
            className="btn-tactile mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-8 py-4 text-base font-bold text-white shadow-vivid-strong transition hover:opacity-95"
          >
            Crea tu sala hoy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function StepCard({
  color,
  icon,
  title,
  body,
}: {
  color: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-surface-container bg-white p-7 shadow-soft">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-md text-white ${color}`}>
        {icon}
      </div>
      <h3 className="mt-5 font-display text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}

function FeaturePill({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="rounded-md border border-surface-container bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2 text-ink">
        <span className="text-ink-muted">{icon}</span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="mt-1 text-xs text-ink-muted">{sub}</p>
    </div>
  );
}

function FeatureItem({
  icon,
  color,
  title,
  body,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${color}`}>{icon}</div>
      <div>
        <h4 className="font-display text-base font-bold text-ink">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
      </div>
    </div>
  );
}
