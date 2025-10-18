import 'server-only';
import { Sayable } from 'sayable';

export default new Sayable({
  en: () =>
    import('./locales/en/messages.json', { with: { type: 'json' } }) //
      .then((m) => m.default),
});
