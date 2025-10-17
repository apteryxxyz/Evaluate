import { defineConfig } from '@sayable/config';

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en'],
  catalogues: [
    {
      include: ['src/**/*.ts'],
      output: 'src/locales/{locale}/messages.{extension}',
    },
  ],
});
