export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
  short: string;
  active: boolean;
}

/**
 * Supported and upcoming site languages.
 * Languages are rolled out daily to ensure high translation fidelity
 * and remain Google Ads / SEO friendly.
 */
export const SITE_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', short: 'EN', active: true },
  { code: 'fr', label: 'French', nativeLabel: 'Français', short: 'FR', active: false },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', short: 'ZH', active: false },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', short: 'JA', active: false },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', short: 'HI', active: false },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский', short: 'RU', active: false },
];

export const DEFAULT_LANGUAGE = 'en';

export const LANGUAGE_STORAGE_KEY = 'pixelify_lang_pref';

/** Helper to get language info by code */
export function getLanguageInfo(code: string): LanguageOption {
  return (
    SITE_LANGUAGES.find((lang) => lang.code === code) ||
    SITE_LANGUAGES[0]
  );
}
