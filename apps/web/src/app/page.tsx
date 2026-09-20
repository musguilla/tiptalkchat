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
import { DiscoverPeople } from '@/components/DiscoverPeople';
import { getServerLocale } from '@/i18n/server';
import { localizeHref } from '@/i18n/routing';
import { t } from '@/i18n';

export default function HomePage() {
  const locale = getServerLocale();
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
              {t(locale, 'home.hero.title')}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
              {t(locale, 'home.hero.subtitle')}
            </p>
            <div className="mt-10">
              <Link
                href={localizeHref('/create', locale)}
                className="btn-tactile inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-12 py-5 text-lg font-bold text-white shadow-vivid transition hover:shadow-vivid-strong sm:w-auto sm:min-w-[24rem]"
              >
                {t(locale, 'home.hero.cta')}
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

      <DiscoverPeople />

      {/* EMPIEZA EN MINUTOS */}
      <section id="como-funciona" className="bg-canvas py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {t(locale, 'home.steps.title')}
            </h2>
            <p className="mt-4 text-base text-ink-muted">
              {t(locale, 'home.steps.subtitle')}
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <StepCard
              color="bg-primary-500"
              icon={<Lock className="h-5 w-5" />}
              title={t(locale, 'home.steps.1.title')}
              body={t(locale, 'home.steps.1.body')}
            />
            <StepCard
              color="bg-secondary-500"
              icon={<Share2 className="h-5 w-5" />}
              title={t(locale, 'home.steps.2.title')}
              body={t(locale, 'home.steps.2.body')}
            />
            <StepCard
              color="bg-blue-500"
              icon={<MessageCircle className="h-5 w-5" />}
              title={t(locale, 'home.steps.3.title')}
              body={t(locale, 'home.steps.3.body')}
            />
          </div>
        </div>
      </section>

      {/* TECNOLOGÍA DE ÉLITE */}
      <section id="caracteristicas" className="bg-canvas py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <FeaturePill icon={<Video className="h-4 w-4" />} title={t(locale, 'home.features.hd.title')} sub={t(locale, 'home.features.hd.sub')} />
            <FeaturePill icon={<Lock className="h-4 w-4" />} title={t(locale, 'home.features.privacy.title')} sub={t(locale, 'home.features.privacy.sub')} />
            <FeaturePill icon={<ShieldCheck className="h-4 w-4" />} title={t(locale, 'home.features.payments.title')} sub={t(locale, 'home.features.payments.sub')} />
            <FeaturePill icon={<Zap className="h-4 w-4" />} title={t(locale, 'home.features.instant.title')} sub={t(locale, 'home.features.instant.sub')} />
          </div>
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {t(locale, 'home.features.title')}
            </h2>
            <div className="mt-10 space-y-7">
              <FeatureItem
                icon={<Mic className="h-5 w-5" />}
                color="bg-primary-50 text-primary-500"
                title={t(locale, 'home.features.voice.title')}
                body={t(locale, 'home.features.voice.body')}
              />
              <FeatureItem
                icon={<CreditCard className="h-5 w-5" />}
                color="bg-secondary-50 text-secondary-500"
                title={t(locale, 'home.features.tips.title')}
                body={t(locale, 'home.features.tips.body')}
              />
              <FeatureItem
                icon={<ShieldCheck className="h-5 w-5" />}
                color="bg-blue-50 text-blue-500"
                title={t(locale, 'home.features.design.title')}
                body={t(locale, 'home.features.design.body')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA LAVENDER */}
      <section id="precios" className="px-6 pb-20">
        <div className="mx-auto max-w-5xl rounded-xl bg-surface-container px-6 py-16 text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t(locale, 'home.final.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-ink-muted">
            {t(locale, 'home.final.subtitle')}
          </p>
          <Link
            href={localizeHref('/create', locale)}
            className="btn-tactile mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-8 py-4 text-base font-bold text-white shadow-vivid-strong transition hover:opacity-95"
          >
            {t(locale, 'home.final.cta')} <ArrowRight className="h-4 w-4" />
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
