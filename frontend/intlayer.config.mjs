import { Locales } from 'intlayer';

/** @type {import('intlayer').IntlayerConfig} */
const config = {
  internationalization: {
    locales: [Locales.ENGLISH, Locales.FRENCH, 'sq'], // Albanian
    defaultLocale: Locales.ENGLISH,
  },
};

export default config;
