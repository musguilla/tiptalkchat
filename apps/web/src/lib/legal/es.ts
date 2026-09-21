import type { LegalCatalog } from './types';

// Spanish source of the legal documents. Paragraph strings support inline
// **bold** and [text](href) markdown. Other locales mirror this structure.
export const es: LegalCatalog = {
  terminos: {
    title: 'Términos y condiciones',
    sections: [
      {
        h: '1. Aceptación de los términos',
        blocks: [
          'Al registrarte, crear una sala o utilizar tiptalk.chat (la «Plataforma») declaras que has leído y aceptas estos Términos y nuestra [política de privacidad](/legal/privacidad). Si no estás de acuerdo, no utilices el servicio.',
        ],
      },
      {
        h: '2. Edad mínima (18+)',
        blocks: [
          'tiptalk.chat es una plataforma **exclusivamente para mayores de 18 años**. Al usarla confirmas que tienes 18 años o más. Está terminantemente prohibido el acceso a menores de edad. Para **recibir dinero** en la Plataforma es obligatorio superar nuestro proceso de **verificación de edad** (documento de identidad válido); hasta que no esté aprobado no es posible activar los cobros.',
        ],
      },
      {
        h: '3. Cuentas y registro',
        blocks: [
          {
            ul: [
              'Debes facilitar información veraz y mantener la confidencialidad de tus credenciales.',
              'Eres responsable de toda la actividad que ocurra en tu cuenta.',
              'No está permitido crear varias cuentas personales ni suplantar a otra persona.',
              'Puedes usar la Plataforma como visitante (sin cuenta), pero algunas funciones y los cobros requieren registro.',
            ],
          },
        ],
      },
      {
        h: '4. Naturaleza del servicio',
        blocks: [
          'tiptalk.chat proporciona la **infraestructura tecnológica** para mantener conversaciones privadas uno a uno por texto, voz y vídeo, y para enviar propinas. Los creadores actúan como **profesionales independientes** (por ejemplo, autónomos): no son empleados de la Plataforma, y son responsables del contenido que comparten y del cumplimiento de sus obligaciones fiscales. La Plataforma no es parte de las conversaciones entre usuarios.',
        ],
      },
      {
        h: '5. Contenido para adultos y verificación',
        blocks: [
          'La Plataforma permite **contenido para adultos** entre usuarios verificados y mayores de edad, siempre que sea legal y consentido. Todo creador que monetice debe estar verificado como adulto. Nos reservamos el derecho de solicitar verificación adicional en cualquier momento. Cualquier indicio de participación de menores o de contenido no consentido conlleva la retirada inmediata y la cancelación de la cuenta, además de la notificación a las autoridades cuando proceda.',
        ],
      },
      {
        h: '6. Conducta y contenido prohibido',
        blocks: [
          'Queda prohibido, y dará lugar a la suspensión o cancelación inmediata de la cuenta:',
          {
            ul: [
              'Cualquier contenido que involucre a **menores de edad**, real o simulado.',
              'Contenido no consentido, violento, de odio, tráfico de personas o cualquier actividad ilegal.',
              'Suplantación de identidad, difusión de datos personales de terceros o material protegido por derechos de autor sin autorización.',
              'Fraude, blanqueo de capitales, uso de medios de pago no autorizados o auto-propinas para manipular ingresos.',
              'Redirigir a los usuarios **fuera de la Plataforma** para eludir comisiones o controles (por ejemplo, compartir contactos o enlaces de pago externos), así como el spam.',
            ],
          },
        ],
      },
      {
        h: '7. Propiedad y licencia del contenido',
        blocks: [
          'Conservas la propiedad del contenido que publicas. Al subirlo, concedes a tiptalk.chat una licencia mundial, no exclusiva y gratuita para alojar, mostrar y transmitir dicho contenido con la única finalidad de operar la Plataforma. Esta licencia termina cuando eliminas el contenido, salvo copias que debamos conservar por obligación legal.',
        ],
      },
      {
        h: '8. Sistema económico (Tipsys)',
        blocks: [
          'Las propinas se denominan en **Tipsys**, una moneda virtual interna sin valor fuera de la Plataforma. La tasa de compra es 1 € = 8 Tipsys y la de cobro 10 Tipsys = 1 €. Sobre el cobro se aplica una comisión de plataforma (actualmente 30 %). Los Tipsys promocionales pueden ajustarse o retirarse si se emiten por error o se usan de forma indebida.',
        ],
      },
      {
        h: '9. Cobros (payouts)',
        blocks: [
          'Los cobros se procesan a través de nuestro **proveedor de pagos** a partir del umbral mínimo indicado en tu monedero. Es necesario completar la verificación de edad e identidad. Por prevención del fraude, protección frente a contracargos y cumplimiento normativo, la Plataforma puede aplicar **retenciones temporales**, o retrasar, rechazar o revertir pagos.',
        ],
      },
      {
        h: '10. Reembolsos',
        blocks: [
          'Las compras de Tipsys y las propinas enviadas son, con carácter general, **no reembolsables**, salvo en los casos en que la legislación aplicable exija lo contrario o cuando exista un error demostrable de la Plataforma.',
        ],
      },
      {
        h: '11. Moderación',
        blocks: [
          'Con el fin de garantizar la seguridad, prevenir el fraude y cumplir la normativa, la Plataforma puede revisar, limitar o retirar contenido y suspender cuentas. El detalle del tratamiento de datos asociado a la moderación se describe en la [política de privacidad](/legal/privacidad).',
        ],
      },
      {
        h: '12. Suspensión y terminación',
        blocks: [
          'Podemos suspender o cancelar tu cuenta si incumples estos Términos o la ley. Puedes cerrar tu cuenta cuando quieras. La información económica se conserva durante el tiempo exigido por la legislación aplicable.',
        ],
      },
      {
        h: '13. Responsabilidad',
        blocks: [
          'tiptalk.chat no se hace responsable del contenido de las conversaciones entre usuarios ni de los fondos **bloqueados, congelados o restringidos por proveedores de pago externos**, cuyas condiciones asume cada usuario. La Plataforma se ofrece «tal cual», sin garantías más allá de las exigidas por la ley.',
        ],
      },
      {
        h: '14. Legislación aplicable',
        blocks: [
          'Estos Términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa aplicable en materia de consumidores.',
        ],
      },
    ],
    note: 'Texto orientativo. Debe ser revisado y completado por asesoría legal (incluida la identificación del titular en el aviso legal) antes de operar en producción.',
  },

  privacidad: {
    title: 'Política de privacidad',
    sections: [
      {
        h: '1. Quién es el responsable',
        blocks: [
          'tiptalk.chat es el responsable del tratamiento de tus datos personales. Puedes contactarnos en [hola@tiptalk.chat](mailto:hola@tiptalk.chat). La identificación completa del responsable figura en el [aviso legal](/legal/aviso-legal).',
        ],
      },
      {
        h: '2. Qué datos tratamos',
        blocks: [
          {
            ul: [
              'Datos de cuenta: email, nombre visible y, si te registras, contraseña cifrada con argon2id.',
              'Mensajes, fotos, vídeos y llamadas dentro de las salas. Las salas de invitados son temporales; las de usuarios registrados permanecen hasta que su propietario las cierra.',
              'Fotos de perfil y de galería que subes a la Plataforma.',
              'Movimientos económicos (compras de Tipsys, propinas, payouts) — auditoría obligatoria.',
              '**Documentos de verificación de edad** (documento de identidad y, en su caso, selfie) que aportas si decides monetizar. Son datos especialmente sensibles y reciben un tratamiento reforzado (ver punto 5).',
              'Grabaciones de moderación: cuando una sesión es supervisada o grabada por seguridad o cumplimiento, se conserva el audio/vídeo o la transcripción durante un plazo limitado.',
            ],
          },
        ],
      },
      {
        h: '3. Cuánto tiempo conservamos los datos',
        blocks: [
          {
            ul: [
              'Los mensajes de texto se eliminan al cerrarse o caducar la sala; las fotos y vídeos subidos se conservan hasta que el propietario o la Plataforma los eliminan.',
              'Los movimientos económicos se conservan según la legislación aplicable (mínimo 6 años en España).',
              'Las grabaciones de moderación, con carácter general, un máximo de 90 días.',
              'Los documentos de verificación de edad, durante la vigencia de la cuenta verificada y el plazo legal de conservación que resulte aplicable.',
            ],
          },
        ],
      },
      {
        h: '4. Supervisión y moderación',
        blocks: [
          'Como plataforma de comunicación entre personas, supervisamos y, cuando es necesario, grabamos las sesiones (texto, voz y vídeo) con fines de **moderación, seguridad y prevención del fraude**. La base jurídica es nuestro interés legítimo en mantener un servicio seguro y libre de abusos, así como el cumplimiento de las obligaciones legales y de las condiciones de nuestros proveedores de pago. Las grabaciones de moderación se conservan solo el tiempo necesario para su finalidad y después se eliminan.',
        ],
      },
      {
        h: '5. Verificación de edad',
        blocks: [
          'Para poder **recibir dinero** es obligatorio verificar que eres mayor de edad. Con esa finalidad tratamos tu documento de identidad y, opcionalmente, un selfie. Estos documentos:',
          {
            ul: [
              'Se almacenan en un repositorio **privado y separado**, nunca accesible de forma pública.',
              'Solo son consultados por el personal autorizado de verificación, a través de enlaces temporales.',
              'Se tratan con la base jurídica del cumplimiento de una obligación legal y tu consentimiento explícito.',
              'No se comparten con otros usuarios ni se usan para ninguna finalidad distinta de la verificación.',
            ],
          },
        ],
      },
      {
        h: '6. Encargados y proveedores',
        blocks: [
          'Para prestar el servicio utilizamos proveedores que actúan como encargados del tratamiento (alojamiento y almacenamiento, procesamiento de pagos, envío de correos y tecnología de llamadas), con las garantías exigidas por la normativa de protección de datos.',
        ],
      },
      {
        h: '7. Tus derechos',
        blocks: [
          'Puedes ejercitar tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a [hola@tiptalk.chat](mailto:hola@tiptalk.chat). También puedes reclamar ante la autoridad de control competente (en España, la AEPD).',
        ],
      },
    ],
    note: 'Este texto es una plantilla orientativa. Cualquier servicio que maneje dinero real, contenido para adultos y datos sensibles debería revisarlo y completarlo con asesoramiento legal antes de operar.',
  },

  'aviso-legal': {
    title: 'Aviso legal',
    sections: [
      {
        h: 'Datos identificativos',
        blocks: [
          'Sitio web operado por **tiptalk.chat**. Para cualquier consulta legal escribe a [hola@tiptalk.chat](mailto:hola@tiptalk.chat).',
        ],
      },
      {
        h: 'Propiedad intelectual',
        blocks: [
          'Todo el contenido del sitio (textos, código, diseño) es propiedad de tiptalk.chat o de sus respectivos titulares. No se permite la reproducción sin autorización.',
        ],
      },
      {
        h: 'Legislación aplicable',
        blocks: [
          'Las presentes condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales del domicilio del usuario o del prestador.',
        ],
      },
    ],
    note: 'Texto orientativo. Debe completarse con la identificación del titular exigida por la normativa (LSSI-CE) antes de operar en producción.',
  },

  cookies: {
    title: 'Política de cookies',
    sections: [
      {
        h: '1. Qué son las cookies',
        blocks: ['Son pequeños archivos que un sitio web guarda en tu dispositivo para recordar tu sesión.'],
      },
      {
        h: '2. Cookies que usamos',
        blocks: [
          {
            ul: [
              '**Necesarias**: token de sesión JWT, almacenado en localStorage. Sin esto no puedes mantener la sesión iniciada.',
              '**Funcionales**: preferencia de modo claro/oscuro (próximamente).',
            ],
          },
          'No usamos cookies de seguimiento o publicitarias de terceros.',
        ],
      },
      {
        h: '3. Terceros',
        blocks: [
          'Algunos servicios externos (Stripe para pagos, Mux para vídeo, LiveKit para llamadas) pueden usar sus propias cookies estrictamente necesarias para su funcionamiento.',
        ],
      },
    ],
  },
};
