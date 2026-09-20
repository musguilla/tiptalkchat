'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  X as XIcon,
  ShieldCheck,
  Loader2,
  Upload,
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { uploadVerificationFile } from '@/lib/upload';
import { useT } from '@/i18n/useLocale';

interface VerificationState {
  status: 'none' | 'pending' | 'verified' | 'rejected';
  verifiedAt: string | null;
  latest: { id: string; status: string; rejectionReason: string | null } | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  token: string;
  /** Called after a successful submission so the parent can refresh. */
  onSubmitted?: () => void;
}

/**
 * Age-verification flow, shown when a user tries to monetize. Collects an 18+
 * declaration, an ID document and (optionally) a selfie, uploads them to the
 * private bucket and submits for admin review.
 */
export function AgeVerificationModal({ open, onClose, token, onSubmitted }: Props) {
  const t = useT();
  const [state, setState] = useState<VerificationState | null>(null);
  const [loading, setLoading] = useState(true);
  const [declared, setDeclared] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const docRef = useRef<HTMLInputElement | null>(null);
  const selfieRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api<VerificationState>('/verification/me', { token })
      .then((r) => setState(r))
      .catch(() => setState(null))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!open) return;
    setDeclared(false);
    setDocFile(null);
    setSelfieFile(null);
    setError(null);
    setDone(false);
    load();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, load]);

  if (!open) return null;

  async function submit(): Promise<void> {
    if (!docFile || !declared) return;
    setBusy(true);
    setError(null);
    try {
      const doc = await uploadVerificationFile(docFile, 'document', token);
      let selfieKey: string | undefined;
      if (selfieFile) {
        const s = await uploadVerificationFile(selfieFile, 'selfie', token);
        selfieKey = s.storageKey;
      }
      await api('/verification/submit', {
        method: 'POST',
        token,
        body: JSON.stringify({ documentKey: doc.storageKey, selfieKey, declaredAdult: true }),
      });
      setDone(true);
      onSubmitted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('cmp.age.submitFailed'));
    } finally {
      setBusy(false);
    }
  }

  const status = state?.status ?? 'none';
  const showForm = !done && (status === 'none' || status === 'rejected');
  const showPending = !done && status === 'pending';

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-vivid-strong"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-container px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
            <ShieldCheck className="h-5 w-5 text-primary-500" />
            {t('cmp.age.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-ink-muted transition hover:bg-surface-soft"
            aria-label={t('cmp.common.close')}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="grid place-items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-ink-soft" />
            </div>
          ) : done || showPending ? (
            <div className="py-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-50 text-amber-500">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{t('cmp.age.inReviewTitle')}</h3>
              <p className="mt-2 text-sm text-ink-muted">
                {t('cmp.age.inReviewBody')}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-tactile mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-6 py-2.5 text-sm font-bold text-white shadow-soft hover:shadow-vivid"
              >
                {t('cmp.age.gotIt')}
              </button>
            </div>
          ) : status === 'verified' ? (
            <div className="py-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-500">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{t('cmp.age.verifiedTitle')}</h3>
              <p className="mt-2 text-sm text-ink-muted">{t('cmp.age.verifiedBody')}</p>
            </div>
          ) : (
            showForm && (
              <>
                <p className="text-sm text-ink-muted">
                  {t('cmp.age.intro')}
                </p>

                {status === 'rejected' && state?.latest?.rejectionReason && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {t('cmp.age.rejected', { reason: state.latest.rejectionReason })}
                    </span>
                  </div>
                )}

                <div className="mt-4 space-y-3">
                  <FilePicker
                    label={t('cmp.age.docLabel')}
                    hint={t('cmp.age.docHint')}
                    file={docFile}
                    inputRef={docRef}
                    onPick={setDocFile}
                    required
                  />
                  <FilePicker
                    label={t('cmp.age.selfieLabel')}
                    hint={t('cmp.age.selfieHint')}
                    file={selfieFile}
                    inputRef={selfieRef}
                    onPick={setSelfieFile}
                  />
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-surface-container bg-surface-soft/50 p-3">
                  <input
                    type="checkbox"
                    checked={declared}
                    onChange={(e) => setDeclared(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-primary-500"
                  />
                  <span className="text-sm text-ink">
                    {t('cmp.age.declarePre')}
                    <strong>{t('cmp.age.declareBold')}</strong>
                    {t('cmp.age.declarePost')}
                  </span>
                </label>

                {error && (
                  <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => void submit()}
                  disabled={busy || !docFile || !declared}
                  className="btn-tactile mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:shadow-vivid disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {t('cmp.age.submit')}
                </button>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function FilePicker({
  label,
  hint,
  file,
  inputRef,
  onPick,
  required,
}: {
  label: string;
  hint: string;
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onPick: (f: File | null) => void;
  required?: boolean;
}) {
  return (
    <div>
      <input
        ref={inputRef as React.Ref<HTMLInputElement>}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
          file
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-dashed border-surface-container bg-surface-soft/40 hover:border-primary-300'
        }`}
      >
        <div
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
            file ? 'bg-emerald-500 text-white' : 'bg-white text-ink-muted'
          }`}
        >
          {file ? <FileCheck2 className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </p>
          <p className="truncate text-xs text-ink-muted">{file ? file.name : hint}</p>
        </div>
      </button>
    </div>
  );
}
