import type { ReactNode } from 'react';
import type { LegalDoc } from '@/lib/legal/types';

/** Render inline **bold** and [text](href) markdown inside a legal paragraph. */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) {
      nodes.push(<strong key={i++}>{tok.slice(2, -2)}</strong>);
    } else {
      const lm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok);
      if (lm) {
        nodes.push(
          <a key={i++} href={lm[2]} className="text-orange-600 underline">
            {lm[1]}
          </a>,
        );
      }
    }
    last = regex.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function LegalArticle({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">{doc.title}</h1>
      <p className="text-sm text-zinc-500">
        Última actualización: {new Date().toLocaleDateString('es-ES')}
      </p>

      {doc.sections.map((section, si) => (
        <section key={si}>
          {section.h && (
            <h2 className={`text-xl font-bold ${si === 0 ? 'mt-8' : 'mt-6'}`}>{section.h}</h2>
          )}
          {section.blocks.map((block, bi) =>
            typeof block === 'string' ? (
              <p key={bi} className={bi === 0 ? '' : 'mt-2'}>
                {renderInline(block)}
              </p>
            ) : (
              <ul key={bi} className="list-disc pl-6">
                {block.ul.map((item, ii) => (
                  <li key={ii}>{renderInline(item)}</li>
                ))}
              </ul>
            ),
          )}
        </section>
      ))}

      {doc.note && <p className="mt-12 text-sm text-zinc-500">{doc.note}</p>}
    </>
  );
}
