import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <SiteHeader variant="minimal" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <article className="prose prose-zinc max-w-none dark:prose-invert">{children}</article>
      </main>
      <SiteFooter />
    </div>
  );
}
