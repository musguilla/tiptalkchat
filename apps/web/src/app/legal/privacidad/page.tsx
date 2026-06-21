export const metadata = { title: 'Política de privacidad · tiptalk.chat' };

export default function PrivacidadPage() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">Política de privacidad</h1>
      <p className="text-sm text-zinc-500">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

      <h2 className="mt-8 text-xl font-bold">1. Quién es el responsable</h2>
      <p>
        tiptalk.chat es el responsable del tratamiento de tus datos personales. Puedes
        contactarnos en{' '}
        <a className="text-orange-600 underline" href="mailto:hola@tiptalk.chat">
          hola@tiptalk.chat
        </a>
        .
      </p>

      <h2 className="mt-6 text-xl font-bold">2. Qué datos tratamos</h2>
      <ul className="list-disc pl-6">
        <li>
          Datos de cuenta: email, nombre visible y, si te registras, contraseña cifrada con argon2id.
        </li>
        <li>
          Mensajes, fotos, vídeos y llamadas dentro de salas, mientras la sala esté activa
          (máximo 24h o hasta que el creador la cierre).
        </li>
        <li>Movimientos económicos (compras de Tipsys, propinas, payouts) — auditoría obligatoria.</li>
      </ul>

      <h2 className="mt-6 text-xl font-bold">3. Cuánto tiempo conservamos los datos</h2>
      <p>
        Los chats y media se borran automáticamente al cerrarse la sala o a las 24h. Los
        movimientos económicos se conservan según la legislación aplicable (mínimo 6 años en España).
      </p>

      <h2 className="mt-6 text-xl font-bold">4. Tus derechos</h2>
      <p>
        Puedes ejercitar tus derechos de acceso, rectificación, supresión, oposición y portabilidad
        escribiendo a{' '}
        <a className="text-orange-600 underline" href="mailto:hola@tiptalk.chat">
          hola@tiptalk.chat
        </a>
        .
      </p>

      <p className="mt-12 text-sm text-zinc-500">
        Este texto es una plantilla orientativa. Cualquier servicio que maneje dinero real y datos personales
        debería revisarlo con asesoramiento legal antes de operar.
      </p>
    </>
  );
}
