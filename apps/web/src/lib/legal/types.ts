// A legal document as data so it can be translated per locale.
// Paragraph strings support inline **bold** and [text](href) markdown.
export type LegalBlock = string | { ul: string[] };
export interface LegalSection {
  h?: string;
  blocks: LegalBlock[];
}
export interface LegalDoc {
  title: string;
  sections: LegalSection[];
  note?: string;
}
export type LegalSlug = 'terminos' | 'privacidad' | 'aviso-legal' | 'cookies';
export type LegalCatalog = Record<LegalSlug, LegalDoc>;
