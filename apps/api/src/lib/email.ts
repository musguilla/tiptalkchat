import { loadEnv } from '@tiptalk/config';

/**
 * Minimal transactional email via Resend's HTTP API (no SDK dependency).
 * Best-effort: when RESEND_API_KEY is unset, sends are skipped so the rest of
 * the app (the in-app inbox) keeps working. Never throws to the caller.
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

/**
 * Corporate-styled "you have a new message" nudge. Deliberately does NOT
 * include the full message body — it drives the recipient back to the
 * platform to read and reply (which is the whole point).
 */
export function renderNewMessageEmail(input: {
  recipientName: string;
  senderName: string;
  preview: string;
  inboxUrl: string;
}): { subject: string; html: string } {
  const subject = `${input.senderName} te ha enviado un mensaje en TipTalk`;
  const preview = escapeHtml(input.preview.slice(0, 140));
  const sender = escapeHtml(input.senderName);
  const recipient = escapeHtml(input.recipientName);

  const html = `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <tr>
          <td style="background:linear-gradient(135deg,#ff2d78 0%,#ff7a1a 100%);padding:28px 32px;">
            <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">tiptalk<span style="opacity:.8;">.chat</span></span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Hola ${recipient},</p>
            <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#111827;font-weight:800;">
              Tienes un mensaje de ${sender}
            </h1>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#f9fafb;border-left:3px solid #ff2d78;border-radius:8px;">
              <tr><td style="padding:14px 16px;font-size:15px;color:#374151;font-style:italic;">
                &ldquo;${preview}${input.preview.length > 140 ? '…' : ''}&rdquo;
              </td></tr>
            </table>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#374151;">
              Entra en tu perfil de TipTalk para leerlo completo y responder. Así podéis empezar a chatear.
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr><td style="border-radius:999px;background:linear-gradient(135deg,#ff2d78 0%,#ff7a1a 100%);">
                <a href="${input.inboxUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">
                  Leer y responder
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f0f0f2;">
            <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
              Recibes este correo porque alguien te ha escrito en TipTalk. Si no quieres recibir estos avisos,
              podrás desactivarlos desde los ajustes de tu perfil.
            </p>
          </td>
        </tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#b0b3bb;">© TipTalk · tiptalk.chat</p>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
