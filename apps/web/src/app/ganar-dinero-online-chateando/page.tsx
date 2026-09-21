import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Coins,
  Video,
  Share2,
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

export const metadata: Metadata = {
  title: 'Ganar dinero online chateando — tiptalk.chat',
  description:
    'Gana dinero online chateando desde casa: abre una sala privada, habla por texto, voz o vídeo y recibe propinas en directo. Gratis para empezar, sin descargas y con retiradas en euros.',
  alternates: { canonical: 'https://tiptalk.chat/ganar-dinero-online-chateando' },
};

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: '¿Cuánto cuesta empezar a ganar dinero chateando?',
    a: 'Nada. Crear tu sala y chatear es gratis y siempre lo será. Lo único que mueve dinero real son las propinas, así que empiezas sin poner un euro por delante.',
  },
  {
    q: '¿Necesito registrarme?',
    a: 'Para probar la plataforma no, puedes abrir una sala solo con un nick. El registro hace falta cuando quieres recibir propinas y retirarlas a tu cuenta, porque ahí ya hay dinero de por medio.',
  },
  {
    q: '¿Cómo retiro lo que gano?',
    a: 'Las propinas son Tipsys y se acumulan en tu monedero. Cuando quieras, las conviertes a euros (10 Tipsys = 1 €) y solicitas la retirada a tu cuenta. Sin permanencias ni mínimos raros.',
  },
  {
    q: '¿Es privado?',
    a: 'Sí. La sala es uno a uno y, cuando la cierras o pasan 24 horas, se borra todo: mensajes, fotos y vídeos. No guardamos grabaciones; solo el registro de las transacciones de propinas, obligatorio por fiscalidad.',
  },
  {
    q: '¿Funciona desde el móvil?',
    a: 'Sí, sin instalar ninguna app. La sala se abre en el navegador del móvil (Chrome, Safari, Firefox) igual que cualquier web, y las llamadas usan la cámara y el micro del teléfono.',
  },
  {
    q: '¿Hay comisiones ocultas?',
    a: 'No. Abrir salas, chatear y llamar es gratis. Solo se aplica la conversión de Tipsys a euros cuando retiras, que te mostramos siempre de forma transparente.',
  },
];

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
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SiteHeader />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-32 -top-24 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(255,92,0,0.18),transparent_70%)]" />
        <div className="absolute -left-32 top-40 -z-10 h-[440px] w-[440px] rounded-full bg-[radial-gradient(closest-side,rgba(255,0,122,0.12),transparent_70%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-600">
              <Sparkles className="h-3.5 w-3.5" /> Convierte tu tiempo en ingresos
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Gana dinero online <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">chateando</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">
              Abre una sala privada, habla por texto, voz o vídeo y recibe propinas en directo.
              Sin descargas, gratis para empezar y con retiradas a tu cuenta cuando quieras.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/create"
                className="btn-tactile inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-8 py-3.5 text-base font-bold text-white shadow-vivid transition hover:shadow-vivid-strong"
              >
                Crear sala gratis <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 rounded-full border border-surface-container bg-white px-6 py-3.5 text-base font-semibold text-ink transition hover:bg-surface-soft"
              >
                Cómo funciona
              </a>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
              {['Gratis para empezar', 'Sin descargas', 'Cobros en euros', 'Tus datos privados'].map((x) => (
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
                    <p className="text-sm font-bold">Tu sala privada</p>
                    <p className="inline-flex items-center gap-1 text-[11px] text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> En directo
                    </p>
                  </div>
                </div>
                <Video className="h-5 w-5" />
              </div>
              <div className="space-y-3 px-1 py-4">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-surface-soft px-3.5 py-2 text-sm text-ink">
                  ¡Hola! Gracias por entrar 💬
                </div>
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary-500 px-3.5 py-2 text-sm text-white">
                  Me encanta hablar contigo
                </div>
                <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3.5 py-1.5 text-sm font-bold text-amber-900 shadow-soft">
                  <Coins className="h-4 w-4" /> +40 Tipsys de propina
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-surface-container px-3 py-2">
                <span className="text-sm text-ink-soft">Escribe un mensaje…</span>
                <span className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-primary-500 text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 rounded-2xl bg-white px-4 py-3 shadow-vivid">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">En tu monedero</p>
              <p className="font-display text-xl font-extrabold text-ink">128,50 €</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST / STATS ============ */}
      <section className="border-y border-surface-container bg-white/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {[
            { big: '0 €', small: 'para abrir tu sala' },
            { big: '8 Tipsys', small: 'por cada 1 € recibido' },
            { big: 'Voz + Vídeo', small: 'HD desde el navegador' },
            { big: '24 h', small: 'y la sala se borra sola' },
          ].map((s) => (
            <div key={s.small} className="text-center">
              <p className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{s.big}</p>
              <p className="mt-1 text-sm text-ink-muted">{s.small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CÓMO FUNCIONA ============ */}
      <section id="como-funciona" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            De cero a cobrar en tres pasos
          </h2>
          <p className="mt-3 text-lg text-ink-muted">
            Sin montar una web, sin papeleo y sin descargar nada. Lo tienes listo en menos de un minuto.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Step
            n={1}
            icon={<MessageCircle className="h-5 w-5" />}
            title="Crea tu sala"
            body="Elige un nombre, pulsa crear y comparte el enlace con quien quieras. En segundos ya estás dentro."
          />
          <Step
            n={2}
            icon={<Video className="h-5 w-5" />}
            title="Conversa como quieras"
            body="Texto, llamadas de voz y videollamadas en HD directamente en el navegador. La calidad se adapta a tu conexión."
          />
          <Step
            n={3}
            icon={<Coins className="h-5 w-5" />}
            title="Recibe propinas"
            body="Quien valora tu tiempo te envía Tipsys que se acumulan en tu monedero. Los conviertes a euros y los retiras cuando quieras."
          />
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/create"
            className="btn-tactile inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-8 py-3.5 text-base font-bold text-white shadow-vivid transition hover:shadow-vivid-strong"
          >
            Empieza ahora, es gratis <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ============ PARA QUIÉN ES ============ */}
      <section className="border-y border-surface-container bg-surface-soft/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Para cualquiera con algo que aportar
            </h2>
            <p className="mt-3 text-lg text-ink-muted">
              Si la gente valora tu conversación, aquí la conviertes en ingresos. Tú pones el tema y el ritmo.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <AudienceCard
              icon={<Heart className="h-5 w-5" />}
              title="Creadores y creadoras"
              body="Monetiza tu comunidad con conversaciones cercanas uno a uno, sin depender del alcance de una red social."
            />
            <AudienceCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Profesionales y consultores"
              body="Cobra por asesorías, consultas y sesiones sin montar una plataforma. Abres la sala, atiendes y cobras."
            />
            <AudienceCard
              icon={<Globe className="h-5 w-5" />}
              title="Profes de idiomas y coaches"
              body="Clases particulares y práctica conversacional pagadas por tiempo, con vídeo en directo y sin instalar nada."
            />
            <AudienceCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Gente con talento para charlar"
              body="Compañía, entretenimiento, apoyo, un buen rato de conversación… si aportas valor, mereces cobrarlo."
            />
          </div>
        </div>
      </section>

      {/* ============ CARACTERÍSTICAS ============ */}
      <section id="caracteristicas" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Todo lo que necesitas para cobrar por chatear
          </h2>
          <p className="mt-3 text-lg text-ink-muted">
            Pensado para que ganar dinero online sea fácil, seguro y privado de verdad.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={<Coins className="h-5 w-5" />} title="Propinas en directo" body="Recibe Tipsys mientras hablas. La animación aparece al instante para que se note el detalle." />
          <Feature icon={<Video className="h-5 w-5" />} title="Vídeo y voz sin apps" body="Videollamadas y llamadas de voz en HD desde el navegador, en el móvil o en el ordenador." />
          <Feature icon={<Lock className="h-5 w-5" />} title="Privacidad real" body="Todo se borra al cerrar la sala o a las 24 horas. No guardamos grabaciones de tus conversaciones." />
          <Feature icon={<Wallet className="h-5 w-5" />} title="Retiradas en euros" body="Convierte tus Tipsys a euros y retíralos a tu cuenta cuando quieras, con total transparencia." />
          <Feature icon={<Zap className="h-5 w-5" />} title="Salas gratis e ilimitadas" body="Crea todas las salas que necesites sin coste. Abrir y chatear no cuesta nada." />
          <Feature icon={<Smartphone className="h-5 w-5" />} title="Funciona en el móvil" body="Sin descargas ni instalaciones. Se abre como cualquier web en Chrome, Safari o Firefox." />
        </div>
      </section>

      {/* ============ ECONOMÍA TIPSYS ============ */}
      <section className="border-y border-surface-container bg-white/60">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Cómo se gana y cómo se cobra
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Las propinas se llaman <strong className="text-ink">Tipsys</strong>. Cuando alguien te las
              envía, se acumulan en tu monedero en tiempo real. Tú decides cuándo convertirlas a euros y
              retirarlas a tu cuenta.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-4 w-4" /></span>
                <span className="text-ink-muted"><strong className="text-ink">1 € = 8 Tipsys</strong> cuando alguien compra propinas para enviarte.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-4 w-4" /></span>
                <span className="text-ink-muted"><strong className="text-ink">10 Tipsys = 1 €</strong> al convertirlos de vuelta para retirar.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-4 w-4" /></span>
                <span className="text-ink-muted">Sin permanencia: retiras cuando quieras a una cuenta que admita transferencias en euros.</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link
                href="/wallet"
                className="inline-flex items-center gap-2 rounded-full border border-surface-container bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-surface-soft"
              >
                <Wallet className="h-4 w-4 text-primary-500" /> Ver el monedero
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-surface-container bg-gradient-to-br from-secondary-500 to-primary-500 p-8 text-white shadow-vivid-strong">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">Ejemplo</p>
            <p className="mt-2 font-display text-2xl font-extrabold">Una sesión de una hora</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-white/15 px-4 py-3">
                <span className="text-sm">Propinas recibidas</span>
                <span className="font-display text-lg font-extrabold">960 Tipsys</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/15 px-4 py-3">
                <span className="text-sm">Al convertir a euros</span>
                <span className="font-display text-lg font-extrabold">96 €</span>
              </div>
              <p className="text-xs text-white/70">
                Ejemplo ilustrativo. Lo que ganas depende de tu público y de cuánto valoren tu tiempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-10 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-surface-container bg-white p-5 shadow-soft"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-ink">
                {f.q}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-soft text-ink-muted transition group-open:rotate-45">
                  +
                </span>
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
          <h2 className="relative font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Empieza a ganar dinero chateando hoy
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/90">
            Abre tu primera sala gratis, comparte el enlace y deja que las propinas empiecen a llegar.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link
              href="/create"
              className="btn-tactile inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-primary-600 shadow-soft transition hover:-translate-y-0.5 hover:shadow-vivid"
            >
              Crear sala gratis <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
