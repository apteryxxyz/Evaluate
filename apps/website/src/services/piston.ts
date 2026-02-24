import { Piston } from 'piston.ts';
import env from '~/env';

export default typeof window !== 'undefined'
  ? new Piston({
      baseUrl: `${window.location.origin}/api/piston`,
    })
  : new Piston({
      apiKey: env.PISTON_API_KEY,
    });
