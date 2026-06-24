'use client';
import { useEffect, useState } from 'react';
import { X as XIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth, type SessionUser } from '@/lib/auth-store';
import { Logo } from './Logo';

interface AuthResponse {
  token: string;
  user: SessionUser;
}

interface Props {
  open: boolean;
  initialMode?: 'login' | 'signup';
  /** When set, after signup we call /auth/upgrade-guest with this token so
   * the user's anon host session is migrated into the new account. */
  upgradeFromGuestToken?: string | null;
  onClose: () => void;
  onSuccess: (token: string, user: SessionUser) => void;
}

export function AuthOverlay({
  open,
  initialMode = 'login',
  upgradeFromGuestToken,
  onClose,
  onSuccess,
}: Props) {
  const setSession = useAuth((s) => s.setSession);
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setError(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, initialMode, onClose]);

  if (!open) return null;

  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const endpoint =
        mode === 'login'
          ? '/auth/login'
          : upgradeFromGuestToken
            ? '/auth/upgrade-guest'
            : '/auth/signup';
      const body =
        mode === 'login'
          ? { email, password }
          : upgradeFromGuestToken
            ? { email, password, displayName: displayName || undefined }
            : { email, password, displayName: displayName || 'Anónimo' };

      const res = await api<AuthResponse>(endpoint, {
        method: 'POST',
        token: upgradeFromGuestToken ?? undefined,
        body: JSON.stringify(body),
      });
      setSession(res.token, res.user);
      onSuccess(res.token, res.user);
    } catch (err) {
      setError(
        mode === 'login'
          ? 'Credenciales no válidas.'
          : 'No se pudo crear la cuenta. ¿El email ya existe?',
      );
      // eslint-disable-next-line no-console
      console.warn(err);
    } finally {
      setBusy(false);
    }
  }

  const isUpgrade = mode === 'signup' && !!upgradeFromGuestToken;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm space-y-5 rounded-lg bg-white p-7 shadow-vivid-strong"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-md text-ink-muted transition hover:bg-surface-soft hover:text-ink"
          aria-label="Cerrar"
        >
          <XIcon className="h-4 w-4" />
        </button>

        <div className="flex justify-center">
          <Logo className="text-2xl" />
        </div>

        <div>
          <h2 className="text-center font-display text-2xl font-extrabold tracking-tight">
            {isUpgrade
              ? 'Activa los pagos'
              : mode === 'login'
                ? 'Iniciar sesión'
                : 'Crear cuenta'}
          </h2>
          {isUpgrade && (
            <p className="mt-2 text-center text-sm text-ink-muted">
              Tu sala se queda contigo. Solo necesitamos un email y una contraseña para que puedas
              recibir propinas.
            </p>
          )}
        </div>

        {mode === 'signup' && (
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium text-ink">Tu nombre</span>
            <input
              required={!isUpgrade}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white"
              placeholder={isUpgrade ? 'Mantén tu nick o cambia' : ''}
            />
          </label>
        )}

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-ink">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white"
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-ink">Contraseña</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="btn-tactile w-full rounded-md bg-primary-500 px-4 py-2.5 font-semibold text-white shadow-soft hover:bg-primary-600 disabled:opacity-60"
        >
          {busy
            ? '…'
            : isUpgrade
              ? 'Activar pagos'
              : mode === 'login'
                ? 'Iniciar sesión'
                : 'Crear cuenta'}
        </button>

        {!isUpgrade && (
          <p className="text-center text-sm text-ink-muted">
            {mode === 'login' ? '¿Sin cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
              }}
              className="font-semibold text-primary-500 hover:underline"
            >
              {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
