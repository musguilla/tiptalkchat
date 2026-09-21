import type { Metadata } from 'next';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

// Per-profile title/description so every /u/<id> is unique (no duplicate metas).
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  let name: string | null = null;
  try {
    const res = await fetch(`${API}/users/${params.id}`, { cache: 'no-store' });
    if (res.ok) {
      const u = (await res.json()) as { displayName?: string };
      name = typeof u.displayName === 'string' ? u.displayName : null;
    }
  } catch {
    /* network/API issues → fall back to a generic title */
  }
  return name
    ? {
        title: `${name} - tiptalk.chat`,
        description: `Perfil de ${name} en tiptalk.chat. Envíale un mensaje y chatea con propinas por texto, voz y vídeo. Chat gratis, sin descargas.`,
      }
    : {
        title: 'Perfil de usuario - tiptalk.chat',
        description:
          'Perfil de usuario en tiptalk.chat. Envía un mensaje y chatea con propinas por texto, voz y vídeo. Chat gratis, sin descargas.',
      };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
