export const metadata = { title: 'Política de cookies · tiptalk.chat' };

export default function CookiesPage() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">Política de cookies</h1>
      <p className="text-sm text-zinc-500">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

      <h2 className="mt-8 text-xl font-bold">1. Qué son las cookies</h2>
      <p>Son pequeños archivos que un sitio web guarda en tu dispositivo para recordar tu sesión.</p>

      <h2 className="mt-6 text-xl font-bold">2. Cookies que usamos</h2>
      <ul className="list-disc pl-6">
        <li>
          <strong>Necesarias</strong>: token de sesión JWT, almacenado en localStorage. Sin esto no
          puedes mantener la sesión iniciada.
        </li>
        <li>
          <strong>Funcionales</strong>: preferencia de modo claro/oscuro (próximamente).
        </li>
      </ul>
      <p className="mt-2">
        No usamos cookies de seguimiento o publicitarias de terceros.
      </p>

      <h2 className="mt-6 text-xl font-bold">3. Terceros</h2>
      <p>
        Algunos servicios externos (Stripe para pagos, Mux para vídeo, LiveKit para llamadas) pueden
        usar sus propias cookies estrictamente necesarias para su funcionamiento.
      </p>
    </>
  );
}
