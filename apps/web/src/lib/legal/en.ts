import type { LegalCatalog } from './types';
// English translation of the legal documents. Mirrors the Spanish source structure.
export const en: Partial<LegalCatalog> = {
  terminos: {
    title: 'Terms & Conditions',
    sections: [
      {
        h: '1. Acceptance of the terms',
        blocks: [
          'By registering, creating a room or using tiptalk.chat (the “Platform”) you declare that you have read and accept these Terms and our [privacy policy](/legal/privacidad). If you do not agree, do not use the service.',
        ],
      },
      {
        h: '2. Minimum age (18+)',
        blocks: [
          'tiptalk.chat is a platform **exclusively for people aged 18 and over**. By using it you confirm that you are 18 years of age or older. Access by minors is strictly prohibited. To **receive money** on the Platform you must pass our **age verification** process (valid identity document); until it is approved, payouts cannot be enabled.',
        ],
      },
      {
        h: '3. Accounts and registration',
        blocks: [
          {
            ul: [
              'You must provide truthful information and keep your credentials confidential.',
              'You are responsible for all activity that occurs on your account.',
              'Creating several personal accounts or impersonating another person is not permitted.',
              'You may use the Platform as a guest (without an account), but some features and payouts require registration.',
            ],
          },
        ],
      },
      {
        h: '4. Nature of the service',
        blocks: [
          'tiptalk.chat provides the **technological infrastructure** to hold private one-to-one conversations by text, voice and video, and to send tips. Creators act as **independent professionals** (for example, self-employed workers): they are not employees of the Platform, and they are responsible for the content they share and for complying with their tax obligations. The Platform is not a party to the conversations between users.',
        ],
      },
      {
        h: '5. Adult content and verification',
        blocks: [
          'The Platform allows **adult content** between verified users of legal age, provided it is lawful and consensual. Every creator who monetizes must be verified as an adult. We reserve the right to request additional verification at any time. Any indication of the involvement of minors or of non-consensual content will lead to immediate removal and cancellation of the account, as well as notification of the authorities where appropriate.',
        ],
      },
      {
        h: '6. Prohibited conduct and content',
        blocks: [
          'The following is prohibited and will result in the immediate suspension or cancellation of the account:',
          {
            ul: [
              'Any content involving **minors**, whether real or simulated.',
              'Non-consensual, violent or hateful content, human trafficking or any illegal activity.',
              'Impersonation, disclosure of the personal data of third parties or of copyright-protected material without authorization.',
              'Fraud, money laundering, use of unauthorized means of payment or self-tipping to manipulate earnings.',
              'Redirecting users **off the Platform** to evade commissions or controls (for example, sharing contact details or external payment links), as well as spam.',
            ],
          },
        ],
      },
      {
        h: '7. Ownership and licence of the content',
        blocks: [
          'You retain ownership of the content you publish. By uploading it, you grant tiptalk.chat a worldwide, non-exclusive and royalty-free licence to host, display and transmit that content for the sole purpose of operating the Platform. This licence ends when you delete the content, except for copies we are required to keep by legal obligation.',
        ],
      },
      {
        h: '8. Economic system (Tipsys)',
        blocks: [
          'Tips are denominated in **Tipsys**, an internal virtual currency with no value outside the Platform. The purchase rate is 1 € = 8 Tipsys and the payout rate is 10 Tipsys = 1 €. A platform commission (currently 30 %) is applied to payouts. Promotional Tipsys may be adjusted or withdrawn if they are issued in error or used improperly.',
        ],
      },
      {
        h: '9. Payouts',
        blocks: [
          'Payouts are processed through our **payment provider** once the minimum threshold shown in your wallet is reached. You must complete age and identity verification. For fraud prevention, protection against chargebacks and regulatory compliance, the Platform may apply **temporary holds**, or delay, reject or reverse payments.',
        ],
      },
      {
        h: '10. Refunds',
        blocks: [
          'Purchases of Tipsys and tips sent are, as a general rule, **non-refundable**, except in cases where applicable law requires otherwise or where there is a demonstrable error by the Platform.',
        ],
      },
      {
        h: '11. Moderation',
        blocks: [
          'In order to ensure safety, prevent fraud and comply with the regulations, the Platform may review, limit or remove content and suspend accounts. The details of the data processing associated with moderation are described in the [privacy policy](/legal/privacidad).',
        ],
      },
      {
        h: '12. Suspension and termination',
        blocks: [
          'We may suspend or cancel your account if you breach these Terms or the law. You may close your account whenever you wish. Financial information is kept for the period required by applicable law.',
        ],
      },
      {
        h: '13. Liability',
        blocks: [
          'tiptalk.chat is not responsible for the content of the conversations between users nor for funds **blocked, frozen or restricted by external payment providers**, whose conditions each user accepts. The Platform is provided “as is”, without warranties beyond those required by law.',
        ],
      },
      {
        h: '14. Governing law',
        blocks: [
          'These Terms are governed by Spanish law. For any dispute, the parties submit to the courts and tribunals that apply in accordance with the relevant consumer protection legislation.',
        ],
      },
    ],
    note: 'Indicative text. It must be reviewed and completed by legal counsel (including the identification of the owner in the legal notice) before operating in production.',
  },

  privacidad: {
    title: 'Privacy Policy',
    sections: [
      {
        h: '1. Who is the controller',
        blocks: [
          'tiptalk.chat is the controller of the processing of your personal data. You can contact us at [hola@tiptalk.chat](mailto:hola@tiptalk.chat). The full identification of the controller appears in the [legal notice](/legal/aviso-legal).',
        ],
      },
      {
        h: '2. What data we process',
        blocks: [
          {
            ul: [
              'Account data: email, display name and, if you register, a password encrypted with argon2id.',
              'Messages, photos, videos and calls within the rooms. Guest rooms are temporary; those of registered users remain until their owner closes them.',
              'Profile and gallery photos that you upload to the Platform.',
              'Financial movements (Tipsys purchases, tips, payouts) — mandatory audit.',
              '**Age verification documents** (identity document and, where applicable, a selfie) that you provide if you decide to monetize. These are especially sensitive data and receive reinforced processing (see point 5).',
              'Moderation recordings: when a session is supervised or recorded for security or compliance, the audio/video or the transcript is kept for a limited period.',
            ],
          },
        ],
      },
      {
        h: '3. How long we keep the data',
        blocks: [
          {
            ul: [
              'Text messages are deleted when the room is closed or expires; uploaded photos and videos are kept until the owner or the Platform deletes them.',
              'Financial movements are kept in accordance with applicable law (a minimum of 6 years in Spain).',
              'Moderation recordings, as a general rule, for a maximum of 90 days.',
              'Age verification documents, for the duration of the verified account and the applicable legal retention period.',
            ],
          },
        ],
      },
      {
        h: '4. Supervision and moderation',
        blocks: [
          'As a communication platform between people, we supervise and, when necessary, record sessions (text, voice and video) for the purposes of **moderation, security and fraud prevention**. The legal basis is our legitimate interest in maintaining a service that is safe and free from abuse, as well as compliance with legal obligations and with the conditions of our payment providers. Moderation recordings are kept only for as long as necessary for their purpose and are then deleted.',
        ],
      },
      {
        h: '5. Age verification',
        blocks: [
          'In order to **receive money** it is mandatory to verify that you are of legal age. For that purpose we process your identity document and, optionally, a selfie. These documents:',
          {
            ul: [
              'Are stored in a **private and separate** repository, never publicly accessible.',
              'Are consulted only by authorized verification staff, through temporary links.',
              'Are processed on the legal basis of compliance with a legal obligation and your explicit consent.',
              'Are not shared with other users nor used for any purpose other than verification.',
            ],
          },
        ],
      },
      {
        h: '6. Processors and providers',
        blocks: [
          'To provide the service we use providers that act as data processors (hosting and storage, payment processing, email delivery and call technology), with the safeguards required by data protection regulations.',
        ],
      },
      {
        h: '7. Your rights',
        blocks: [
          'You can exercise your rights of access, rectification, erasure, objection, restriction and portability by writing to [hola@tiptalk.chat](mailto:hola@tiptalk.chat). You may also lodge a complaint with the competent supervisory authority (in Spain, the AEPD).',
        ],
      },
    ],
    note: 'This text is an indicative template. Any service that handles real money, adult content and sensitive data should review and complete it with legal advice before operating.',
  },

  'aviso-legal': {
    title: 'Legal Notice',
    sections: [
      {
        h: 'Identifying information',
        blocks: [
          'Website operated by **tiptalk.chat**. For any legal enquiry, write to [hola@tiptalk.chat](mailto:hola@tiptalk.chat).',
        ],
      },
      {
        h: 'Intellectual property',
        blocks: [
          'All the content of the site (texts, code, design) is the property of tiptalk.chat or of its respective owners. Reproduction without authorization is not permitted.',
        ],
      },
      {
        h: 'Governing law',
        blocks: [
          'These conditions are governed by Spanish law. For any dispute, the parties submit to the courts and tribunals of the domicile of the user or of the provider.',
        ],
      },
    ],
    note: 'Indicative text. It must be completed with the identification of the owner required by the regulations (LSSI-CE) before operating in production.',
  },

  cookies: {
    title: 'Cookie Policy',
    sections: [
      {
        h: '1. What cookies are',
        blocks: ['They are small files that a website stores on your device to remember your session.'],
      },
      {
        h: '2. Cookies we use',
        blocks: [
          {
            ul: [
              '**Necessary**: JWT session token, stored in localStorage. Without this you cannot stay logged in.',
              '**Functional**: light/dark mode preference (coming soon).',
            ],
          },
          'We do not use third-party tracking or advertising cookies.',
        ],
      },
      {
        h: '3. Third parties',
        blocks: [
          'Some external services (Stripe for payments, Mux for video, LiveKit for calls) may use their own strictly necessary cookies for their operation.',
        ],
      },
    ],
  },
};
