import type { LegalCatalog } from './types';
// Empty until translated; falls back to the Spanish source per document.
export const ptBr: Partial<LegalCatalog> = {
  terminos: {
    title: 'Termos e condições',
    sections: [
      {
        h: '1. Aceitação dos termos',
        blocks: [
          'Ao se registrar, criar uma sala ou utilizar o tiptalk.chat (a “Plataforma”), você declara que leu e aceita estes Termos e nossa [política de privacidade](/legal/privacidad). Se não concordar, não utilize o serviço.',
        ],
      },
      {
        h: '2. Idade mínima (18+)',
        blocks: [
          'O tiptalk.chat é uma plataforma **exclusivamente para maiores de 18 anos**. Ao utilizá-la, você confirma que tem 18 anos ou mais. É terminantemente proibido o acesso a menores de idade. Para **receber dinheiro** na Plataforma é obrigatório passar pelo nosso processo de **verificação de idade** (documento de identidade válido); enquanto não estiver aprovado, não é possível ativar os recebimentos.',
        ],
      },
      {
        h: '3. Contas e registro',
        blocks: [
          {
            ul: [
              'Você deve fornecer informações verídicas e manter a confidencialidade de suas credenciais.',
              'Você é responsável por toda a atividade que ocorrer em sua conta.',
              'Não é permitido criar várias contas pessoais nem se passar por outra pessoa.',
              'Você pode usar a Plataforma como visitante (sem conta), mas algumas funções e os recebimentos exigem registro.',
            ],
          },
        ],
      },
      {
        h: '4. Natureza do serviço',
        blocks: [
          'O tiptalk.chat fornece a **infraestrutura tecnológica** para manter conversas privadas de um para um por texto, voz e vídeo, e para enviar gorjetas. Os criadores atuam como **profissionais independentes** (por exemplo, autônomos): não são funcionários da Plataforma e são responsáveis pelo conteúdo que compartilham e pelo cumprimento de suas obrigações fiscais. A Plataforma não é parte das conversas entre usuários.',
        ],
      },
      {
        h: '5. Conteúdo adulto e verificação',
        blocks: [
          'A Plataforma permite **conteúdo adulto** entre usuários verificados e maiores de idade, desde que seja legal e consentido. Todo criador que monetize deve estar verificado como adulto. Reservamo-nos o direito de solicitar verificação adicional a qualquer momento. Qualquer indício de participação de menores ou de conteúdo não consentido acarreta a remoção imediata e o cancelamento da conta, além da notificação às autoridades quando cabível.',
        ],
      },
      {
        h: '6. Conduta e conteúdo proibido',
        blocks: [
          'É proibido, e dará lugar à suspensão ou ao cancelamento imediato da conta:',
          {
            ul: [
              'Qualquer conteúdo que envolva **menores de idade**, real ou simulado.',
              'Conteúdo não consentido, violento, de ódio, tráfico de pessoas ou qualquer atividade ilegal.',
              'Falsidade ideológica, divulgação de dados pessoais de terceiros ou material protegido por direitos autorais sem autorização.',
              'Fraude, lavagem de dinheiro, uso de meios de pagamento não autorizados ou autogorjetas para manipular receitas.',
              'Redirecionar os usuários para **fora da Plataforma** para burlar comissões ou controles (por exemplo, compartilhar contatos ou links de pagamento externos), bem como o spam.',
            ],
          },
        ],
      },
      {
        h: '7. Propriedade e licença do conteúdo',
        blocks: [
          'Você conserva a propriedade do conteúdo que publica. Ao carregá-lo, você concede ao tiptalk.chat uma licença mundial, não exclusiva e gratuita para hospedar, exibir e transmitir esse conteúdo com a única finalidade de operar a Plataforma. Essa licença termina quando você exclui o conteúdo, salvo cópias que devamos conservar por obrigação legal.',
        ],
      },
      {
        h: '8. Sistema econômico (Tipsys)',
        blocks: [
          'As gorjetas são denominadas em **Tipsys**, uma moeda virtual interna sem valor fora da Plataforma. A taxa de compra é 1 € = 8 Tipsys e a de recebimento 10 Tipsys = 1 €. Sobre o recebimento aplica-se uma comissão de plataforma (atualmente 30 %). Os Tipsys promocionais podem ser ajustados ou retirados se forem emitidos por erro ou usados de forma indevida.',
        ],
      },
      {
        h: '9. Recebimentos (payouts)',
        blocks: [
          'Os recebimentos são processados através do nosso **provedor de pagamentos** a partir do limite mínimo indicado em sua carteira. É necessário concluir a verificação de idade e de identidade. Por prevenção de fraude, proteção contra estornos e cumprimento normativo, a Plataforma pode aplicar **retenções temporárias**, ou atrasar, recusar ou reverter pagamentos.',
        ],
      },
      {
        h: '10. Reembolsos',
        blocks: [
          'As compras de Tipsys e as gorjetas enviadas são, de modo geral, **não reembolsáveis**, salvo nos casos em que a legislação aplicável exija o contrário ou quando houver um erro comprovável da Plataforma.',
        ],
      },
      {
        h: '11. Moderação',
        blocks: [
          'A fim de garantir a segurança, prevenir a fraude e cumprir a normativa, a Plataforma pode revisar, limitar ou remover conteúdo e suspender contas. O detalhe do tratamento de dados associado à moderação está descrito na [política de privacidade](/legal/privacidad).',
        ],
      },
      {
        h: '12. Suspensão e rescisão',
        blocks: [
          'Podemos suspender ou cancelar sua conta se você descumprir estes Termos ou a lei. Você pode encerrar sua conta quando quiser. As informações econômicas são conservadas durante o tempo exigido pela legislação aplicável.',
        ],
      },
      {
        h: '13. Responsabilidade',
        blocks: [
          'O tiptalk.chat não se responsabiliza pelo conteúdo das conversas entre usuários nem pelos fundos **bloqueados, congelados ou restritos por provedores de pagamento externos**, cujas condições cada usuário assume. A Plataforma é oferecida “no estado em que se encontra”, sem garantias além das exigidas por lei.',
        ],
      },
      {
        h: '14. Legislação aplicável',
        blocks: [
          'Estes Termos regem-se pela legislação espanhola. Para qualquer controvérsia, as partes submetem-se aos juizados e tribunais competentes conforme a normativa aplicável em matéria de consumidores.',
        ],
      },
    ],
    note: 'Texto orientativo. Deve ser revisado e completado por assessoria jurídica (incluída a identificação do titular no aviso legal) antes de operar em produção.',
  },

  privacidad: {
    title: 'Política de privacidade',
    sections: [
      {
        h: '1. Quem é o responsável',
        blocks: [
          'O tiptalk.chat é o responsável pelo tratamento dos seus dados pessoais. Você pode nos contatar em [hola@tiptalk.chat](mailto:hola@tiptalk.chat). A identificação completa do responsável consta no [aviso legal](/legal/aviso-legal).',
        ],
      },
      {
        h: '2. Quais dados tratamos',
        blocks: [
          {
            ul: [
              'Dados de conta: email, nome visível e, se você se registrar, senha criptografada com argon2id.',
              'Mensagens, fotos, vídeos e chamadas dentro das salas. As salas de visitantes são temporárias; as de usuários registrados permanecem até que seu proprietário as feche.',
              'Fotos de perfil e de galeria que você carrega na Plataforma.',
              'Movimentações econômicas (compras de Tipsys, gorjetas, payouts) — auditoria obrigatória.',
              '**Documentos de verificação de idade** (documento de identidade e, se for o caso, selfie) que você fornece se decidir monetizar. São dados especialmente sensíveis e recebem um tratamento reforçado (ver ponto 5).',
              'Gravações de moderação: quando uma sessão é supervisionada ou gravada por segurança ou cumprimento, o áudio/vídeo ou a transcrição é conservado por um prazo limitado.',
            ],
          },
        ],
      },
      {
        h: '3. Por quanto tempo conservamos os dados',
        blocks: [
          {
            ul: [
              'As mensagens de texto são excluídas ao se fechar ou expirar a sala; as fotos e vídeos carregados são conservados até que o proprietário ou a Plataforma os excluam.',
              'As movimentações econômicas são conservadas conforme a legislação aplicável (mínimo de 6 anos na Espanha).',
              'As gravações de moderação, de modo geral, no máximo 90 dias.',
              'Os documentos de verificação de idade, durante a vigência da conta verificada e o prazo legal de conservação que for aplicável.',
            ],
          },
        ],
      },
      {
        h: '4. Supervisão e moderação',
        blocks: [
          'Como plataforma de comunicação entre pessoas, supervisionamos e, quando necessário, gravamos as sessões (texto, voz e vídeo) para fins de **moderação, segurança e prevenção de fraude**. A base jurídica é o nosso interesse legítimo em manter um serviço seguro e livre de abusos, bem como o cumprimento das obrigações legais e das condições dos nossos provedores de pagamento. As gravações de moderação são conservadas apenas pelo tempo necessário à sua finalidade e depois são excluídas.',
        ],
      },
      {
        h: '5. Verificação de idade',
        blocks: [
          'Para poder **receber dinheiro** é obrigatório verificar que você é maior de idade. Com essa finalidade, tratamos seu documento de identidade e, opcionalmente, uma selfie. Esses documentos:',
          {
            ul: [
              'São armazenados em um repositório **privado e separado**, nunca acessível de forma pública.',
              'Só são consultados pelo pessoal autorizado de verificação, por meio de links temporários.',
              'São tratados com a base jurídica do cumprimento de uma obrigação legal e o seu consentimento explícito.',
              'Não são compartilhados com outros usuários nem usados para qualquer finalidade distinta da verificação.',
            ],
          },
        ],
      },
      {
        h: '6. Operadores e provedores',
        blocks: [
          'Para prestar o serviço, utilizamos provedores que atuam como operadores do tratamento (hospedagem e armazenamento, processamento de pagamentos, envio de emails e tecnologia de chamadas), com as garantias exigidas pela normativa de proteção de dados.',
        ],
      },
      {
        h: '7. Seus direitos',
        blocks: [
          'Você pode exercer seus direitos de acesso, retificação, exclusão, oposição, limitação e portabilidade escrevendo para [hola@tiptalk.chat](mailto:hola@tiptalk.chat). Você também pode reclamar perante a autoridade de controle competente (na Espanha, a AEPD).',
        ],
      },
    ],
    note: 'Este texto é um modelo orientativo. Qualquer serviço que lide com dinheiro real, conteúdo adulto e dados sensíveis deveria revisá-lo e completá-lo com assessoria jurídica antes de operar.',
  },

  'aviso-legal': {
    title: 'Aviso legal',
    sections: [
      {
        h: 'Dados identificativos',
        blocks: [
          'Site operado por **tiptalk.chat**. Para qualquer consulta jurídica, escreva para [hola@tiptalk.chat](mailto:hola@tiptalk.chat).',
        ],
      },
      {
        h: 'Propriedade intelectual',
        blocks: [
          'Todo o conteúdo do site (textos, código, design) é propriedade do tiptalk.chat ou de seus respectivos titulares. Não é permitida a reprodução sem autorização.',
        ],
      },
      {
        h: 'Legislação aplicável',
        blocks: [
          'As presentes condições regem-se pela legislação espanhola. Para qualquer controvérsia, as partes submetem-se aos juizados e tribunais do domicílio do usuário ou do prestador.',
        ],
      },
    ],
    note: 'Texto orientativo. Deve ser completado com a identificação do titular exigida pela normativa (LSSI-CE) antes de operar em produção.',
  },

  cookies: {
    title: 'Política de cookies',
    sections: [
      {
        h: '1. O que são cookies',
        blocks: ['São pequenos arquivos que um site guarda no seu dispositivo para lembrar sua sessão.'],
      },
      {
        h: '2. Cookies que usamos',
        blocks: [
          {
            ul: [
              '**Necessárias**: token de sessão JWT, armazenado no localStorage. Sem isso, você não consegue manter a sessão iniciada.',
              '**Funcionais**: preferência de modo claro/escuro (em breve).',
            ],
          },
          'Não usamos cookies de rastreamento ou publicitárias de terceiros.',
        ],
      },
      {
        h: '3. Terceiros',
        blocks: [
          'Alguns serviços externos (Stripe para pagamentos, Mux para vídeo, LiveKit para chamadas) podem usar seus próprios cookies estritamente necessários para o seu funcionamento.',
        ],
      },
    ],
  },
};
