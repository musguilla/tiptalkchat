export const metadata = { title: 'Aviso legal · tiptalk.chat' };

export default function AvisoLegalPage() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">Aviso legal</h1>
      <p className="text-sm text-zinc-500">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

      <h2 className="mt-8 text-xl font-bold">Datos identificativos</h2>
      <p>
        Sitio web operado por <strong>tiptalk.chat</strong>. Para cualquier consulta legal escribe a{' '}
        <a className="text-orange-600 underline" href="mailto:hola@tiptalk.chat">
          hola@tiptalk.chat
        </a>
        .
      </p>

      <h2 className="mt-6 text-xl font-bold">Propiedad intelectual</h2>
      <p>
        Todo el contenido del sitio (textos, código, diseño) es propiedad de tiptalk.chat o de sus
        respectivos titulares. No se permite la reproducción sin autorización.
      </p>

      <h2 className="mt-6 text-xl font-bold">Legislación aplicable</h2>
      <p>
        Las presentes condiciones se rigen por la legislación española. Para cualquier controversia,
        las partes se someten a los juzgados y tribunales del domicilio del usuario o del prestador.
      </p>

      <p className="mt-12 text-sm text-zinc-500">
        Texto orientativo. Debe completarse con la identificación del titular exigida por la
        normativa (LSSI-CE) antes de operar en producción.
      </p>
    </>
  );
}
