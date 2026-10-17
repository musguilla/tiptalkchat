import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Coins,
  Video,
  Wallet,
  ShieldCheck,
  Lock,
  Smartphone,
  Zap,
  Heart,
  Sparkles,
  MessageCircle,
  Check,
  Globe,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getServerLocale } from '@/i18n/server';
import { t } from '@/i18n';
import { localizeHref } from '@/i18n/routing';
import { localizedSlug } from '@/i18n/slugs';
import { LOCALES } from '@/i18n/config';

const SITE = 'https://www.tiptalk.chat';
const CANON_SLUG = 'ganar-dinero-online-chateando';

export function generateMetadata(): Metadata {
  const l = getServerLocale();
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = SITE + localizeHref(`/${localizedSlug(CANON_SLUG, loc)}`, loc);
  }
  return {
    title: t(l, 'gd.meta.title'),
    description: t(l, 'gd.meta.desc'),
    alternates: {
      canonical: SITE + localizeHref(`/${localizedSlug(CANON_SLUG, l)}`, l),
      languages,
    },
  };
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}): React.ReactElement {
  return (
    <div className="relative rounded-2xl border border-surface-container bg-white p-6 shadow-soft">
      <span className="absolute -top-3 left-6 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 text-xs font-extrabold text-white shadow">
        {n}
      </span>
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-500">
        {icon}
      </div>
      <h3 className="font-display text-lg font-extrabold tracking-tight text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}): React.ReactElement {
  return (
    <div className="rounded-2xl border border-surface-container bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-vivid">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-secondary-500/10 to-primary-500/10 text-primary-500">
        {icon}
      </div>
      <h3 className="font-display text-base font-extrabold tracking-tight text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}

function AudienceCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}): React.ReactElement {
  return (
    <div className="flex gap-4 rounded-2xl border border-surface-container bg-surface-soft/40 p-5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-primary-500 shadow-soft">
        {icon}
      </div>
      <div>
        <h3 className="font-display text-base font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
      </div>
    </div>
  );
}

export default function GanarDineroPage(): React.ReactElement {
  const l = getServerLocale();
  const tr = (k: string): string => t(l, k);
  const createHref = localizeHref('/create', l);
  const walletHref = localizeHref('/wallet', l);

  const faqs = [1, 2, 3, 4, 5, 6].map((i) => ({
    q: tr(`gd.faq${i}.q`),
    a: tr(`gd.faq${i}.a`),
  }));

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const stats = [
    { big: tr('gd.stat1.big'), small: tr('gd.stat1.small') },
    { big: tr('gd.stat2.big'), small: tr('gd.stat2.small') },
    { big: tr('gd.stat3.big'), small: tr('gd.stat3.small') },
    { big: tr('gd.stat4.big'), small: tr('gd.stat4.small') },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SiteHeader />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-32 -top-24 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(255,92,0,0.18),transparent_70%)]" />
        <div className="absolute -left-32 top-40 -z-10 h-[440px] w-[440px] rounded-full bg-[radial-gradient(closest-side,rgba(255,0,122,0.12),transparent_70%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {tr('gd.hero.titleMain')}{' '}
              <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">
                {tr('gd.hero.titleAccent')}
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">{tr('gd.hero.sub')}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={createHref}
                className="btn-tactile inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-8 py-3.5 text-base font-bold text-white shadow-vivid transition hover:shadow-vivid-strong"
              >
                {tr('gd.cta.create')} <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 rounded-full border border-surface-container bg-white px-6 py-3.5 text-base font-semibold text-ink transition hover:bg-surface-soft"
              >
                {tr('gd.cta.how')}
              </a>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
              {[tr('gd.hero.trust1'), tr('gd.hero.trust2'), tr('gd.hero.trust3')].map((x) => (
                <li key={x} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" /> {x}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual: chat mockup with a live tip */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-[26px] border border-surface-container bg-white p-4 shadow-vivid-strong">
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500 px-4 py-3 text-white">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 font-display font-extrabold">A</span>
                  <div className="leading-tight">
                    <p className="text-sm font-bold">{tr('gd.mock.room')}</p>
                    <p className="inline-flex items-center gap-1 text-[11px] text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> {tr('gd.mock.live')}
                    </p>
                  </div>
                </div>
                <Video className="h-5 w-5" />
              </div>
              <div className="space-y-3 px-1 py-4">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-surface-soft px-3.5 py-2 text-sm text-ink">
                  {tr('gd.mock.msg1')}
                </div>
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary-500 px-3.5 py-2 text-sm text-white">
                  {tr('gd.mock.msg2')}
                </div>
                <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3.5 py-1.5 text-sm font-bold text-amber-900 shadow-soft">
                  <Coins className="h-4 w-4" /> {tr('gd.mock.tip')}
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-surface-container px-3 py-2">
                <span className="text-sm text-ink-soft">{tr('gd.mock.input')}</span>
                <span className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-primary-500 text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 rounded-2xl bg-white px-4 py-3 shadow-vivid">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">{tr('gd.mock.wallet')}</p>
              <p className="font-display text-xl font-extrabold text-ink">128,50 €</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST / STATS ============ */}
      <section className="border-y border-surface-container bg-white/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.small} className="text-center">
              <p className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{s.big}</p>
              <p className="mt-1 text-sm text-ink-muted">{s.small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FOTO + CHAT ANIMADO ============ */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/ganar-dinero-chateando.jpg"
              alt={tr('gd.anim.h2')}
              width={2000}
              height={1333}
              className="aspect-[4/5] w-full rounded-[28px] object-cover object-[72%_center] shadow-vivid-strong"
            />
            <div className="tt-chat-bubble absolute left-3 top-6 max-w-[68%] rounded-2xl rounded-tl-sm bg-white/95 px-3.5 py-2 text-sm font-medium text-ink shadow-vivid backdrop-blur" style={{ animationDelay: '0s' }}>
              {tr('gd.anim.bubble1')}
            </div>
            <div className="tt-chat-bubble absolute right-3 top-28 max-w-[68%] rounded-2xl rounded-tr-sm bg-primary-500 px-3.5 py-2 text-sm font-medium text-white shadow-vivid" style={{ animationDelay: '1.4s' }}>
              {tr('gd.anim.bubble2')}
            </div>
            <div className="tt-chat-bubble absolute bottom-24 left-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3.5 py-1.5 text-sm font-bold text-amber-900 shadow-vivid" style={{ animationDelay: '2.8s' }}>
              <Coins className="h-4 w-4" /> {tr('gd.anim.bubble3')}
            </div>
            <div className="tt-chat-bubble absolute bottom-6 right-4 max-w-[60%] rounded-2xl rounded-tr-sm bg-white/95 px-3.5 py-2 text-sm font-medium text-ink shadow-vivid backdrop-blur" style={{ animationDelay: '4.2s' }}>
              {tr('gd.anim.bubble4')}
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-600">
              <MessageCircle className="h-3.5 w-3.5" /> {tr('gd.anim.badge')}
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{tr('gd.anim.h2')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{tr('gd.anim.p')}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[tr('gd.anim.li1'), tr('gd.anim.li2'), tr('gd.anim.li3')].map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-ink-muted">{x}</span>
                </li>
              ))}
            </ul>
            <Link
              href={createHref}
              className="btn-tactile mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-7 py-3.5 text-base font-bold text-white shadow-vivid transition hover:shadow-vivid-strong"
            >
              {tr('gd.cta.create')} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CÓMO FUNCIONA ============ */}
      <section id="como-funciona" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{tr('gd.how.h2')}</h2>
          <p className="mt-3 text-lg text-ink-muted">{tr('gd.how.sub')}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Step n={1} icon={<MessageCircle className="h-5 w-5" />} title={tr('gd.how.s1.title')} body={tr('gd.how.s1.body')} />
          <Step n={2} icon={<Video className="h-5 w-5" />} title={tr('gd.how.s2.title')} body={tr('gd.how.s2.body')} />
          <Step n={3} icon={<Coins className="h-5 w-5" />} title={tr('gd.how.s3.title')} body={tr('gd.how.s3.body')} />
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href={createHref}
            className="btn-tactile inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-8 py-3.5 text-base font-bold text-white shadow-vivid transition hover:shadow-vivid-strong"
          >
            {tr('gd.how.cta')} <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ============ PARA QUIÉN ES ============ */}
      <section className="border-y border-surface-container bg-surface-soft/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{tr('gd.who.h2')}</h2>
            <p className="mt-3 text-lg text-ink-muted">{tr('gd.who.sub')}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <AudienceCard icon={<Heart className="h-5 w-5" />} title={tr('gd.who.a1.title')} body={tr('gd.who.a1.body')} />
            <AudienceCard icon={<ShieldCheck className="h-5 w-5" />} title={tr('gd.who.a2.title')} body={tr('gd.who.a2.body')} />
            <AudienceCard icon={<Globe className="h-5 w-5" />} title={tr('gd.who.a3.title')} body={tr('gd.who.a3.body')} />
            <AudienceCard icon={<Sparkles className="h-5 w-5" />} title={tr('gd.who.a4.title')} body={tr('gd.who.a4.body')} />
          </div>
        </div>
      </section>

      {/* ============ CARACTERÍSTICAS ============ */}
      <section id="caracteristicas" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{tr('gd.feat.h2')}</h2>
          <p className="mt-3 text-lg text-ink-muted">{tr('gd.feat.sub')}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={<Coins className="h-5 w-5" />} title={tr('gd.feat.f1.title')} body={tr('gd.feat.f1.body')} />
          <Feature icon={<Video className="h-5 w-5" />} title={tr('gd.feat.f2.title')} body={tr('gd.feat.f2.body')} />
          <Feature icon={<Lock className="h-5 w-5" />} title={tr('gd.feat.f3.title')} body={tr('gd.feat.f3.body')} />
          <Feature icon={<Wallet className="h-5 w-5" />} title={tr('gd.feat.f4.title')} body={tr('gd.feat.f4.body')} />
          <Feature icon={<Zap className="h-5 w-5" />} title={tr('gd.feat.f5.title')} body={tr('gd.feat.f5.body')} />
          <Feature icon={<Smartphone className="h-5 w-5" />} title={tr('gd.feat.f6.title')} body={tr('gd.feat.f6.body')} />
        </div>
      </section>

      {/* ============ ECONOMÍA TIPSYS ============ */}
      <section className="border-y border-surface-container bg-white/60">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{tr('gd.eco.h2')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{tr('gd.eco.p')}</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-4 w-4" /></span>
                <span className="text-ink-muted"><strong className="text-ink">{tr('gd.eco.li1.lead')}</strong> {tr('gd.eco.li1.rest')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-4 w-4" /></span>
                <span className="text-ink-muted"><strong className="text-ink">{tr('gd.eco.li2.lead')}</strong> {tr('gd.eco.li2.rest')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-4 w-4" /></span>
                <span className="text-ink-muted">{tr('gd.eco.li3')}</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link
                href={walletHref}
                className="inline-flex items-center gap-2 rounded-full border border-surface-container bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-surface-soft"
              >
                <Wallet className="h-4 w-4 text-primary-500" /> {tr('gd.eco.walletBtn')}
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-surface-container bg-gradient-to-br from-secondary-500 to-primary-500 p-8 text-white shadow-vivid-strong">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">{tr('gd.eco.ex.label')}</p>
            <p className="mt-2 font-display text-2xl font-extrabold">{tr('gd.eco.ex.title')}</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-white/15 px-4 py-3">
                <span className="text-sm">{tr('gd.eco.ex.row1')}</span>
                <span className="font-display text-lg font-extrabold">{tr('gd.eco.ex.row1v')}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/15 px-4 py-3">
                <span className="text-sm">{tr('gd.eco.ex.row2')}</span>
                <span className="font-display text-lg font-extrabold">{tr('gd.eco.ex.row2v')}</span>
              </div>
              <p className="text-xs text-white/70">{tr('gd.eco.ex.note')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{tr('gd.faq.title')}</h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-surface-container bg-white p-5 shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-ink">
                {f.q}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-soft text-ink-muted transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-500 to-primary-500 px-8 py-16 text-center text-white shadow-vivid-strong sm:px-16">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{tr('gd.final.h2')}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/90">{tr('gd.final.sub')}</p>
          <div className="relative mt-8 flex justify-center">
            <Link
              href={createHref}
              className="btn-tactile inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-primary-600 shadow-soft transition hover:-translate-y-0.5 hover:shadow-vivid"
            >
              {tr('gd.cta.create')} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}
