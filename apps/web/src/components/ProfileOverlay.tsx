'use client';
import { useEffect, useRef, useState } from 'react';
import { X as XIcon, Camera, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { uploadAvatar } from '@/lib/upload';
import { useAuth, type SessionUser } from '@/lib/auth-store';
import { Logo } from './Logo';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Profile editor modal. Lets the logged-in user change their displayName
 * and upload a new avatar. Avatar goes through the same Supabase upload
 * pipeline as chat images, then we PATCH /auth/me with the resulting
 * publicUrl.
 */
export function ProfileOverlay({ open, onClose }: Props) {
  const token = useAuth((s) => s.token);
  const user = useAuth((s) => s.user);
  const patchUser = useAuth((s) => s.patchUser);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open || !user) return;
    setDisplayName(user.displayName);
    setEmail(user.email);
    setAvatarUrl(user.avatarUrl ?? null);
    setMsg(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, user, onClose]);

  if (!open || !user || !token) return null;

  async function pickAvatar(file: File): Promise<void> {
    if (!token) return;
    setUploadPct(0);
    setMsg(null);
    try {
      const res = await uploadAvatar(file, token, setUploadPct);
      setAvatarUrl(res.publicUrl);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'No se pudo subir la imagen');
    } finally {
      setUploadPct(null);
    }
  }

  async function save(): Promise<void> {
    if (!token || !user) return;
    setBusy(true);
    setMsg(null);
    try {
      const patch: { displayName?: string; email?: string; avatarUrl?: string | null } = {};
      if (displayName !== user.displayName) patch.displayName = displayName.trim();
      if (email.trim() !== user.email) patch.email = email.trim();
      if (avatarUrl !== (user.avatarUrl ?? null)) patch.avatarUrl = avatarUrl ?? null;
      if (Object.keys(patch).length === 0) {
        onClose();
        return;
      }
      const updated = await api<SessionUser>('/auth/me', {
        method: 'PATCH',
        token,
        body: JSON.stringify(patch),
      });
      patchUser({
        displayName: updated.displayName,
        email: updated.email,
        avatarUrl: updated.avatarUrl ?? null,
      });
      onClose();
    } catch (err) {
      const apiMsg =
        err && typeof err === 'object' && 'payload' in err
          ? ((err as { payload?: { message?: string } }).payload?.message ?? null)
          : null;
      setMsg(apiMsg ?? (err instanceof Error ? err.message : 'No se pudo guardar'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-xl bg-white p-7 shadow-vivid-strong dark:bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-md text-ink-muted transition hover:bg-surface-soft hover:text-ink"
          aria-label="Cerrar"
        >
          <XIcon className="h-4 w-4" />
        </button>

        <div className="flex justify-center">
          <Logo className="text-xl" />
        </div>

        <h2 className="mt-3 text-center font-display text-2xl font-extrabold tracking-tight">
          Tu perfil
        </h2>

        <div className="mt-5 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group relative h-24 w-24 overflow-hidden rounded-full bg-primary-500 transition hover:opacity-90"
            title="Cambiar foto"
            disabled={uploadPct !== null}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center text-3xl font-bold text-white">
                {displayName[0]?.toUpperCase() ?? '?'}
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-ink/60 py-1.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
              {uploadPct !== null ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> {uploadPct}%
                </>
              ) : (
                <>
                  <Camera className="h-3 w-3" /> Cambiar
                </>
              )}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void pickAvatar(file);
              if (inputRef.current) inputRef.current.value = '';
            }}
          />
        </div>

        <label className="mt-5 block space-y-1.5 text-sm">
          <span className="font-medium text-ink">Nombre</span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={40}
            className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white"
          />
        </label>

        <label className="mt-4 block space-y-1.5 text-sm">
          <span className="font-medium text-ink">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
            className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white"
          />
        </label>

        {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}

        <button
          type="button"
          onClick={save}
          disabled={busy || uploadPct !== null || !displayName.trim()}
          className="btn-tactile mt-5 w-full rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-4 py-3 font-bold text-white shadow-vivid hover:shadow-vivid-strong disabled:opacity-60"
        >
          {busy ? '…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
