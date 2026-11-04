import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import pt from './pt.json';
import zh from './zh.json';
import ja from './ja.json';
import ko from './ko.json';
import hi from './hi.json';
import ru from './ru.json';
import { useApp } from '@/components/AppProvider';

export const DICTIONARIES: Record<string, typeof en> = {
  en,
  es,
  fr,
  pt,
  zh,
  ja,
  ko,
  hi,
  ru,
};

/**
 * Returns the dictionary for a specific language code with automatic English fallback.
 */
export function getDictionary(lang?: string): typeof en {
  if (!lang) return DICTIONARIES.en;
  return DICTIONARIES[lang] || DICTIONARIES.en;
}

/**
 * React hook that returns the active dictionary and current language.
 */
export function useTranslation() {
  const { currentLang } = useApp();
  const dict = getDictionary(currentLang);
  return {
    t: dict,
    lang: currentLang,
  };
}
