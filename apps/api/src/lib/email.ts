import { loadEnv } from '@tiptalk/config';

/**
 * Transactional email via Resend's HTTP API (no SDK dependency).
 * Best-effort: when RESEND_API_KEY is unset, sends are skipped so the rest of
 * the app keeps working. Never throws to the caller.
 */

export function emailConfigured(): boolean {
  return Boolean(loadEnv().RESEND_API_KEY);
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const env = loadEnv();
  if (!env.RESEND_API_KEY) return { ok: false, skipped: true };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [input.to],
        subject: input.subject,
        html: input.html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { ok: false, error: `Resend ${res.status}: ${text.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'send failed' };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function appBase(): string {
  return loadEnv().PUBLIC_BASE_URL.replace(/\/$/, '');
}

/**
 * Shared "cool" branded layout for every TipTalk email: hidden preheader,
 * gradient header with the wordmark, a big emoji + title, the body, a CTA
 * button and a footer. All specific templates build on this.
 */
export function renderEmailLayout(input: {
  preview: string;
  emoji: string;
  title: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
  footerNote?: string;
}): string {
  const preview = escapeHtml(input.preview);
  return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <tr>
          <td style="background:linear-gradient(135deg,#ff2d78 0%,#ff7a1a 100%);padding:26px 32px;">
            <span style="font-size:23px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">tiptalk<span style="color:#ffe1ec;">.chat</span></span>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px 8px;text-align:center;">
            <div style="font-size:52px;line-height:1;margin-bottom:14px;">${input.emoji}</div>
            <h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#111827;font-weight:800;">${input.title}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 8px;font-size:15px;line-height:1.6;color:#374151;text-align:center;">
            ${input.bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 36px;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" align="center">
              <tr><td style="border-radius:999px;background:linear-gradient(135deg,#ff2d78 0%,#ff7a1a 100%);">
                <a href="${input.ctaUrl}" style="display:inline-block;padding:15px 34px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">${escapeHtml(input.ctaLabel)}</a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f0f0f2;">
            <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;text-align:center;">
              ${escapeHtml(input.footerNote ?? 'Recibes este correo porque tienes una cuenta en TipTalk.')}
            </p>
          </td>
        </tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#b0b3bb;">© TipTalk · tiptalk.chat</p>
    </td></tr>
  </table>
</body>
</html>`;
}

// --- Specific templates ---------------------------------------------------

/** Someone sent you a message (body intentionally omitted → log in to read). */
export function renderNewMessageEmail(input: {
  recipientName: string;
  senderName: string;
}): { subject: string; html: string } {
  const sender = escapeHtml(input.senderName);
  return {
    subject: `💬 ${input.senderName} te ha enviado un mensaje en TipTalk`,
    html: renderEmailLayout({
      preview: `${input.senderName} quiere hablar contigo en TipTalk`,
      emoji: '💬',
      title: `Tienes un mensaje de ${sender}`,
      bodyHtml: `<p style="margin:0;">Hola ${escapeHtml(input.recipientName)}, <strong>${sender}</strong> te ha escrito. Entra en TipTalk para leerlo y responder — así podéis empezar a chatear. 👀</p>`,
      ctaLabel: 'Leer y responder',
      ctaUrl: `${appBase()}/mensajes`,
    }),
  };
}

/** Someone started following you. */
export function renderNewFollowerEmail(input: {
  recipientName: string;
  followerName: string;
  followerId: string;
}): { subject: string; html: string } {
  const follower = escapeHtml(input.followerName);
  return {
    subject: `🎉 ${input.followerName} ha empezado a seguirte en TipTalk`,
    html: renderEmailLayout({
      preview: `${input.followerName} te sigue en TipTalk`,
      emoji: '🎉',
      title: `¡${follower} te sigue!`,
      bodyHtml: `<p style="margin:0;">Hola ${escapeHtml(input.recipientName)}, <strong>${follower}</strong> acaba de empezar a seguirte. Echa un vistazo a su perfil y síguele de vuelta para estar en contacto. 🤝</p>`,
      ctaLabel: 'Ver su perfil',
      ctaUrl: `${appBase()}/u/${input.followerId}`,
    }),
  };
}

/** Someone you follow uploaded new content. */
export function renderNewContentEmail(input: {
  recipientName: string;
  authorName: string;
  authorId: string;
}): { subject: string; html: string } {
  const author = escapeHtml(input.authorName);
  return {
    subject: `✨ ${input.authorName} ha subido contenido nuevo`,
    html: renderEmailLayout({
      preview: `Contenido nuevo de ${input.authorName} en TipTalk`,
      emoji: '✨',
      title: `${author} tiene algo nuevo`,
      bodyHtml: `<p style="margin:0;">Hola ${escapeHtml(input.recipientName)}, <strong>${author}</strong>, a quien sigues, acaba de subir contenido nuevo a su perfil. ¡No te lo pierdas! 🔥</p>`,
      ctaLabel: 'Ver su perfil',
      ctaUrl: `${appBase()}/u/${input.authorId}`,
    }),
  };
}

/** Nudge: user has no avatar. */
export function renderAvatarNudgeEmail(input: {
  recipientName: string;
  userId: string;
}): { subject: string; html: string } {
  return {
    subject: '📸 Ponle cara a tu perfil de TipTalk',
    html: renderEmailLayout({
      preview: 'Añade una foto de perfil y destaca en TipTalk',
      emoji: '📸',
      title: '¿Le ponemos cara a tu perfil?',
      bodyHtml: `<p style="margin:0;">Hola ${escapeHtml(input.recipientName)}, tu perfil todavía no tiene foto. Los perfiles con foto reciben <strong>muchas más visitas y mensajes</strong>. Sube una en un momento y empieza a destacar. 😊</p>`,
      ctaLabel: 'Añadir mi foto',
      ctaUrl: `${appBase()}/u/${input.userId}`,
      footerNote:
        'Te enviamos este consejo para ayudarte a sacarle partido a tu perfil de TipTalk.',
    }),
  };
}

/** Nudge: user has no gallery photos. */
export function renderGalleryNudgeEmail(input: {
  recipientName: string;
  userId: string;
}): { subject: string; html: string } {
  return {
    subject: '🖼️ Llena tu galería en TipTalk',
    html: renderEmailLayout({
      preview: 'Sube fotos a tu galería y recibe más visitas',
      emoji: '🖼️',
      title: 'Tu galería está vacía',
      bodyHtml: `<p style="margin:0;">Hola ${escapeHtml(input.recipientName)}, aún no has subido fotos a tu galería. Comparte algunas —públicas o privadas— para que quien visite tu perfil quiera <strong>seguirte y escribirte</strong>. ✨</p>`,
      ctaLabel: 'Subir fotos',
      ctaUrl: `${appBase()}/u/${input.userId}`,
      footerNote:
        'Te enviamos este consejo para ayudarte a sacarle partido a tu perfil de TipTalk.',
    }),
  };
}
