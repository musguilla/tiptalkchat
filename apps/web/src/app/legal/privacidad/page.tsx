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
        <li>
          Grabaciones de moderación: cuando una sesión es supervisada o grabada por seguridad o
          cumplimiento, se conserva el audio/vídeo o la transcripción resultante durante un plazo
          limitado.
        </li>
      </ul>

      <h2 className="mt-6 text-xl font-bold">3. Cuánto tiempo conservamos los datos</h2>
      <p>
        Los chats y media se borran automáticamente al cerrarse la sala o a las 24h. Los
        movimientos económicos se conservan según la legislación aplicable (mínimo 6 años en España).
      </p>

      <h2 className="mt-6 text-xl font-bold">4. Supervisión y moderación</h2>
      <p>
        Como plataforma de comunicación entre personas, supervisamos y, cuando es necesario,
        grabamos las sesiones (texto, voz y vídeo) con fines de <strong>moderación, seguridad y
        prevención del fraude</strong>. La base jurídica de este tratamiento es nuestro interés
        legítimo en mantener un servicio seguro y libre de abusos, así como el cumplimiento de las
        obligaciones legales y de las condiciones impuestas por nuestros proveedores de pago. Un
        moderador autorizado puede observar una videollamada en directo sin aparecer como
        participante. Las grabaciones de moderación se conservan solo el tiempo necesario para su
        finalidad (con carácter general, un máximo de 90 días, salvo que deban conservarse más
        tiempo por un procedimiento o una obligación legal) y después se eliminan.
      </p>

      <h2 className="mt-6 text-xl font-bold">5. Tus derechos</h2>
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
