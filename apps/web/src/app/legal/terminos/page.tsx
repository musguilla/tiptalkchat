export const metadata = { title: 'Términos y condiciones · tiptalk.chat' };

export default function TerminosPage() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">Términos y condiciones</h1>
      <p className="text-sm text-zinc-500">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

      <h2 className="mt-8 text-xl font-bold">1. Aceptación de los términos</h2>
      <p>
        Al registrarte, crear una sala o utilizar tiptalk.chat (la &laquo;Plataforma&raquo;) declaras
        que has leído y aceptas estos Términos y nuestra{' '}
        <a className="text-orange-600 underline" href="/legal/privacidad">
          política de privacidad
        </a>
        . Si no estás de acuerdo, no utilices el servicio.
      </p>

      <h2 className="mt-6 text-xl font-bold">2. Edad mínima (18+)</h2>
      <p>
        tiptalk.chat es una plataforma <strong>exclusivamente para mayores de 18 años</strong>. Al
        usarla confirmas que tienes 18 años o más. Está terminantemente prohibido el acceso a
        menores de edad. Para <strong>recibir dinero</strong> en la Plataforma es obligatorio superar
        nuestro proceso de <strong>verificación de edad</strong> (documento de identidad válido);
        hasta que no esté aprobado no es posible activar los cobros.
      </p>

      <h2 className="mt-6 text-xl font-bold">3. Cuentas y registro</h2>
      <ul className="list-disc pl-6">
        <li>Debes facilitar información veraz y mantener la confidencialidad de tus credenciales.</li>
        <li>Eres responsable de toda la actividad que ocurra en tu cuenta.</li>
        <li>No está permitido crear varias cuentas personales ni suplantar a otra persona.</li>
        <li>Puedes usar la Plataforma como visitante (sin cuenta), pero algunas funciones y los cobros requieren registro.</li>
      </ul>

      <h2 className="mt-6 text-xl font-bold">4. Naturaleza del servicio</h2>
      <p>
        tiptalk.chat proporciona la <strong>infraestructura tecnológica</strong> para mantener
        conversaciones privadas uno a uno por texto, voz y vídeo, y para enviar propinas. Los
        creadores actúan como <strong>profesionales independientes</strong> (por ejemplo, autónomos):
        no son empleados de la Plataforma, y son responsables del contenido que comparten y del
        cumplimiento de sus obligaciones fiscales. La Plataforma no es parte de las conversaciones
        entre usuarios.
      </p>

      <h2 className="mt-6 text-xl font-bold">5. Contenido para adultos y verificación</h2>
      <p>
        La Plataforma permite <strong>contenido para adultos</strong> entre usuarios verificados y
        mayores de edad, siempre que sea legal y consentido. Todo creador que monetice debe estar
        verificado como adulto. Nos reservamos el derecho de solicitar verificación adicional en
        cualquier momento. Cualquier indicio de participación de menores o de contenido no
        consentido conlleva la retirada inmediata y la cancelación de la cuenta, además de la
        notificación a las autoridades cuando proceda.
      </p>

      <h2 className="mt-6 text-xl font-bold">6. Conducta y contenido prohibido</h2>
      <p>Queda prohibido, y dará lugar a la suspensión o cancelación inmediata de la cuenta:</p>
      <ul className="list-disc pl-6">
        <li>Cualquier contenido que involucre a <strong>menores de edad</strong>, real o simulado.</li>
        <li>Contenido no consentido, violento, de odio, tráfico de personas o cualquier actividad ilegal.</li>
        <li>Suplantación de identidad, difusión de datos personales de terceros o material protegido por derechos de autor sin autorización.</li>
        <li>Fraude, blanqueo de capitales, uso de medios de pago no autorizados o auto-propinas para manipular ingresos.</li>
        <li>
          Redirigir a los usuarios <strong>fuera de la Plataforma</strong> para eludir comisiones o
          controles (por ejemplo, compartir contactos o enlaces de pago externos), así como el spam.
        </li>
      </ul>

      <h2 className="mt-6 text-xl font-bold">7. Propiedad y licencia del contenido</h2>
      <p>
        Conservas la propiedad del contenido que publicas. Al subirlo, concedes a tiptalk.chat una
        licencia mundial, no exclusiva y gratuita para alojar, mostrar y transmitir dicho contenido
        con la única finalidad de operar la Plataforma. Esta licencia termina cuando eliminas el
        contenido, salvo copias que debamos conservar por obligación legal.
      </p>

      <h2 className="mt-6 text-xl font-bold">8. Sistema económico (Tipsys)</h2>
      <p>
        Las propinas se denominan en <strong>Tipsys</strong>, una moneda virtual interna sin valor
        fuera de la Plataforma. La tasa de compra es 1 € = 8 Tipsys y la de cobro 10 Tipsys = 1 €.
        Sobre el cobro se aplica una comisión de plataforma (actualmente 30 %). Los Tipsys
        promocionales pueden ajustarse o retirarse si se emiten por error o se usan de forma
        indebida.
      </p>

      <h2 className="mt-6 text-xl font-bold">9. Cobros (payouts)</h2>
      <p>
        Los cobros se procesan a través de nuestro <strong>proveedor de pagos</strong> a partir del
        umbral mínimo indicado en tu monedero. Es necesario completar la verificación de edad e
        identidad. Por prevención del fraude, protección frente a contracargos y cumplimiento
        normativo, la Plataforma puede aplicar <strong>retenciones temporales</strong>, o retrasar,
        rechazar o revertir pagos.
      </p>

      <h2 className="mt-6 text-xl font-bold">10. Reembolsos</h2>
      <p>
        Las compras de Tipsys y las propinas enviadas son, con carácter general,{' '}
        <strong>no reembolsables</strong>, salvo en los casos en que la legislación aplicable exija
        lo contrario o cuando exista un error demostrable de la Plataforma.
      </p>

      <h2 className="mt-6 text-xl font-bold">11. Moderación</h2>
      <p>
        Con el fin de garantizar la seguridad, prevenir el fraude y cumplir la normativa, la
        Plataforma puede revisar, limitar o retirar contenido y suspender cuentas. El detalle del
        tratamiento de datos asociado a la moderación se describe en la{' '}
        <a className="text-orange-600 underline" href="/legal/privacidad">
          política de privacidad
        </a>
        .
      </p>

      <h2 className="mt-6 text-xl font-bold">12. Suspensión y terminación</h2>
      <p>
        Podemos suspender o cancelar tu cuenta si incumples estos Términos o la ley. Puedes cerrar tu
        cuenta cuando quieras. La información económica se conserva durante el tiempo exigido por la
        legislación aplicable.
      </p>

      <h2 className="mt-6 text-xl font-bold">13. Responsabilidad</h2>
      <p>
        tiptalk.chat no se hace responsable del contenido de las conversaciones entre usuarios ni de
        los fondos <strong>bloqueados, congelados o restringidos por proveedores de pago externos</strong>,
        cuyas condiciones asume cada usuario. La Plataforma se ofrece &laquo;tal cual&raquo;, sin
        garantías más allá de las exigidas por la ley.
      </p>

      <h2 className="mt-6 text-xl font-bold">14. Legislación aplicable</h2>
      <p>
        Estos Términos se rigen por la legislación española. Para cualquier controversia, las partes
        se someten a los juzgados y tribunales que correspondan conforme a la normativa aplicable en
        materia de consumidores.
      </p>

      <p className="mt-12 text-sm text-zinc-500">
        Texto orientativo. Debe ser revisado y completado por asesoría legal (incluida la
        identificación del titular en el aviso legal) antes de operar en producción.
      </p>
    </>
  );
}
