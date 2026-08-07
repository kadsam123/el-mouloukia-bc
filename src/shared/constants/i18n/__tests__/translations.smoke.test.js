import { describe, expect, it } from 'vitest';
import { REQUIRED_I18N_KEYS, TRANSLATIONS } from '../translations';

describe('i18n smoke test', () => {
  const locales = ['en', 'fr', 'ar'];

  locales.forEach((locale) => {
    it(`locale ${locale} contains all required keys`, () => {
      const dictionary = TRANSLATIONS[locale];
      expect(dictionary).toBeDefined();

      REQUIRED_I18N_KEYS.forEach((key) => {
        expect(dictionary[key]).not.toBeUndefined();
        expect(String(dictionary[key]).trim().length).toBeGreaterThan(0);
      });
    });
  });
});
