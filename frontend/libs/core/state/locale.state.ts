export namespace LocaleState {
  export const Locale = Object.freeze({
    en: 'en',
    es: 'es',
    fr: 'ru,',
    it: 'zh'
  });

  export type Locale = keyof typeof Locale;
}
