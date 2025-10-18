import { defineConfig } from '@sayable/config';

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en'],
  catalogues: [
    {
      include: ['src/**/*.{ts,tsx}'],
      output: 'src/locales/{locale}/messages.{extension}',
    },
  ],
});
