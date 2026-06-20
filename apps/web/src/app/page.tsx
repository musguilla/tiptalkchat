import Link from 'next/link';
import { t } from '@/i18n';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 via-zinc-50 to-amber-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 px-6 py-24 text-center">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-2xl font-black text-white">
            T
          </div>
          <h1 className="text-2xl font-black tracking-tight">TipTalk</h1>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold sm:text-5xl">{t('es', 'landing.title')}</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{t('es', 'landing.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/create"
            className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            {t('es', 'landing.cta.create')}
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {t('es', 'auth.login')}
          </Link>
        </div>
        <div className="mt-8 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
          <Feature title="URLs cortas" body="tiptalk.chat/r/tu-sala — comparte y entra." />
          <Feature title="Llamadas + media" body="Chat, voz, vídeo y archivos sin instalar nada." />
          <Feature title="Tipsys" body="Compra propinas y canjéalas a partir de 300 Tipsys." />
        </div>
      </div>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-sm font-bold">{title}</div>
      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{body}</div>
    </div>
  );
}
