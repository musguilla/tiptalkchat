export const metadata = { title: 'Política de privacidad · tiptalk.chat' };

export default function PrivacidadPage() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">Política de privacidad</h1>
      <p className="text-sm text-zinc-500">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

      <h2 className="mt-8 text-xl font-bold">1. Quién es el responsable</h2>
      <p>
        tiptalk.chat es el responsable del tratamiento de tus datos personales. Puedes contactarnos
        en{' '}
        <a className="text-orange-600 underline" href="mailto:hola@tiptalk.chat">
          hola@tiptalk.chat
        </a>
        . La identificación completa del responsable figura en el{' '}
        <a className="text-orange-600 underline" href="/legal/aviso-legal">
          aviso legal
        </a>
        .
      </p>

      <h2 className="mt-6 text-xl font-bold">2. Qué datos tratamos</h2>
      <ul className="list-disc pl-6">
        <li>
          Datos de cuenta: email, nombre visible y, si te registras, contraseña cifrada con argon2id.
        </li>
        <li>
          Mensajes, fotos, vídeos y llamadas dentro de las salas. Las salas de invitados son
          temporales; las de usuarios registrados permanecen hasta que su propietario las cierra.
        </li>
        <li>
          Fotos de perfil y de galería que subes a la Plataforma.
        </li>
        <li>Movimientos económicos (compras de Tipsys, propinas, payouts) — auditoría obligatoria.</li>
        <li>
          <strong>Documentos de verificación de edad</strong> (documento de identidad y, en su
          caso, selfie) que aportas si decides monetizar. Son datos especialmente sensibles y
          reciben un tratamiento reforzado (ver punto 5).
        </li>
        <li>
          Grabaciones de moderación: cuando una sesión es supervisada o grabada por seguridad o
          cumplimiento, se conserva el audio/vídeo o la transcripción durante un plazo limitado.
        </li>
      </ul>

      <h2 className="mt-6 text-xl font-bold">3. Cuánto tiempo conservamos los datos</h2>
      <ul className="list-disc pl-6">
        <li>
          Los mensajes de texto se eliminan al cerrarse o caducar la sala; las fotos y vídeos
          subidos se conservan hasta que el propietario o la Plataforma los eliminan.
        </li>
        <li>Los movimientos económicos se conservan según la legislación aplicable (mínimo 6 años en España).</li>
        <li>Las grabaciones de moderación, con carácter general, un máximo de 90 días.</li>
        <li>
          Los documentos de verificación de edad, durante la vigencia de la cuenta verificada y el
          plazo legal de conservación que resulte aplicable.
        </li>
      </ul>

      <h2 className="mt-6 text-xl font-bold">4. Supervisión y moderación</h2>
      <p>
        Como plataforma de comunicación entre personas, supervisamos y, cuando es necesario,
        grabamos las sesiones (texto, voz y vídeo) con fines de <strong>moderación, seguridad y
        prevención del fraude</strong>. La base jurídica es nuestro interés legítimo en mantener un
        servicio seguro y libre de abusos, así como el cumplimiento de las obligaciones legales y de
        las condiciones de nuestros proveedores de pago. Las grabaciones de moderación se conservan
        solo el tiempo necesario para su finalidad y después se eliminan.
      </p>

      <h2 className="mt-6 text-xl font-bold">5. Verificación de edad</h2>
      <p>
        Para poder <strong>recibir dinero</strong> es obligatorio verificar que eres mayor de edad.
        Con esa finalidad tratamos tu documento de identidad y, opcionalmente, un selfie. Estos
        documentos:
      </p>
      <ul className="list-disc pl-6">
        <li>Se almacenan en un repositorio <strong>privado y separado</strong>, nunca accesible de forma pública.</li>
        <li>Solo son consultados por el personal autorizado de verificación, a través de enlaces temporales.</li>
        <li>Se tratan con la base jurídica del cumplimiento de una obligación legal y tu consentimiento explícito.</li>
        <li>No se comparten con otros usuarios ni se usan para ninguna finalidad distinta de la verificación.</li>
      </ul>

      <h2 className="mt-6 text-xl font-bold">6. Encargados y proveedores</h2>
      <p>
        Para prestar el servicio utilizamos proveedores que actúan como encargados del tratamiento
        (alojamiento y almacenamiento, procesamiento de pagos, envío de correos y tecnología de
        llamadas), con las garantías exigidas por la normativa de protección de datos.
      </p>

      <h2 className="mt-6 text-xl font-bold">7. Tus derechos</h2>
      <p>
        Puedes ejercitar tus derechos de acceso, rectificación, supresión, oposición, limitación y
        portabilidad escribiendo a{' '}
        <a className="text-orange-600 underline" href="mailto:hola@tiptalk.chat">
          hola@tiptalk.chat
        </a>
        . También puedes reclamar ante la autoridad de control competente (en España, la AEPD).
      </p>

      <p className="mt-12 text-sm text-zinc-500">
        Este texto es una plantilla orientativa. Cualquier servicio que maneje dinero real, contenido
        para adultos y datos sensibles debería revisarlo y completarlo con asesoramiento legal antes
        de operar.
      </p>
    </>
  );
}
