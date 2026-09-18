export const metadata = { title: 'Términos y condiciones · tiptalk.chat' };

export default function TerminosPage() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">Términos y condiciones</h1>
      <p className="text-sm text-zinc-500">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

      <h2 className="mt-8 text-xl font-bold">1. Aceptación de los términos</h2>
      <p>
        Al crear una sala, registrarte o utilizar tiptalk.chat aceptas estos términos. Si no estás
        de acuerdo, no utilices el servicio.
      </p>

      <h2 className="mt-6 text-xl font-bold">2. Uso del servicio</h2>
      <ul className="list-disc pl-6">
        <li>tiptalk.chat ofrece salas privadas para conversaciones uno a uno.</li>
        <li>No está permitido el envío de contenido ilegal, abusivo o protegido por copyright sin autorización.</li>
        <li>Cualquier intento de fraude, lavado de dinero o auto-tipeo dará lugar a la cancelación inmediata de la cuenta.</li>
      </ul>

      <h2 className="mt-6 text-xl font-bold">3. Sistema económico (Tipsys)</h2>
      <p>
        Las propinas se denominan en Tipsys, una moneda interna. La tasa de compra es 1 € = 8 Tipsys
        y la de cobro 10 Tipsys = 1 €. Sobre el cobro se aplica una comisión de plataforma
        (actualmente 30 %).
      </p>

      <h2 className="mt-6 text-xl font-bold">4. Cobros (payouts)</h2>
      <p>
        Los cobros se realizan vía Stripe Connect a partir de 300 Tipsys (30 € brutos). Es necesario
        completar el proceso de verificación KYC.
      </p>

      <h2 className="mt-6 text-xl font-bold">5. Moderación y supervisión de contenidos</h2>
      <p>
        tiptalk.chat es una plataforma de comunicación entre personas. Para garantizar la seguridad
        de sus usuarios, prevenir el fraude y cumplir con la normativa aplicable (incluidas las
        exigencias de nuestros proveedores de pago), <strong>las sesiones pueden ser supervisadas,
        observadas y grabadas</strong> por nuestro equipo de moderación. Esto incluye:
      </p>
      <ul className="list-disc pl-6">
        <li>Los mensajes de texto, imágenes y archivos compartidos en las salas.</li>
        <li>
          El audio y el vídeo de las videollamadas y llamadas de voz en directo, que un moderador
          autorizado puede visualizar en tiempo real sin necesidad de aviso previo dentro de la
          sesión concreta.
        </li>
        <li>
          La grabación puntual de una sesión cuando exista sospecha de un uso indebido, una
          infracción de estos términos o una obligación legal.
        </li>
      </ul>
      <p>
        La supervisión se realiza con la única finalidad de moderación, seguridad y cumplimiento
        legal. Las grabaciones se conservan durante el tiempo estrictamente necesario para esos
        fines y solo son accesibles para el personal autorizado. Al utilizar tiptalk.chat aceptas
        expresamente esta supervisión. Puedes consultar cómo tratamos estos datos en nuestra{' '}
        <a className="text-orange-600 underline" href="/legal/privacidad">
          política de privacidad
        </a>
        .
      </p>

      <h2 className="mt-6 text-xl font-bold">6. Responsabilidad</h2>
      <p>
        tiptalk.chat no se hace responsable del contenido de las conversaciones entre usuarios. Los
        chats se borran automáticamente a las 24 horas.
      </p>

      <p className="mt-12 text-sm text-zinc-500">
        Texto orientativo. Revisa con tu asesoría legal antes de ofrecer el servicio en producción.
      </p>
    </>
  );
}
