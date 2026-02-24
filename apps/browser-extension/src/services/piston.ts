import { Piston } from 'piston.ts';
import env from '~/env.js';

export default new Piston({
  baseUrl: `${env.VITE_PUBLIC_WEBSITE_URL}api/piston`,
});
