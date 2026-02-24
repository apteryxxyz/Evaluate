import { Piston } from 'piston.ts';
import env from '../env.js';

export default new Piston({
  apiKey: env.PISTON_API_KEY,
});
