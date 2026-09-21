import type { Locale } from '../config';
import { adminA } from './admin-a';
import { adminB } from './admin-b';
import { components } from './components';
import { pages } from './pages';
import { seo } from './seo';
import { home } from './home';
import { errors } from './errors';

type Dict = Record<string, string>;
type NS = Partial<Record<Locale, Dict>>;

const NAMESPACES: NS[] = [adminA, adminB, components, pages, seo, home, errors];

// Merge every namespace into a single { locale: { key: value } } map.
export const gen: Record<string, Dict> = (() => {
  const out: Record<string, Dict> = {};
  for (const ns of NAMESPACES) {
    for (const [loc, dict] of Object.entries(ns)) {
      out[loc] = { ...(out[loc] ?? {}), ...(dict as Dict) };
    }
  }
  return out;
})();
