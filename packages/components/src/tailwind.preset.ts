import { resolve } from 'node:path';
import type { Config as TailwindConfig } from 'tailwindcss';

const tailwindConfig = {
  content: [resolve(__dirname, '../src/**/*.{ts,tsx}')],
} satisfies TailwindConfig;

export default tailwindConfig;
