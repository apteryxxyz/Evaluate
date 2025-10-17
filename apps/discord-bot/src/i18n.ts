import { Sayable } from 'sayable';

const say = new Sayable({
  en: () =>
    import('./locales/en/messages.json', { with: { type: 'json' } }) //
      .then((m) => m.default),
});

await say.load();
say.activate(say.locales[0]!);

export default say;
