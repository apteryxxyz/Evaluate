import { absoluteUrl } from '~utilities/url-helpers';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeSwitcher } from './theme-switcher';

export function HeaderBar() {
  return (
    <header className="h-14 flex items-center">
      <a
        target="_blank"
        rel="noreferrer noopener"
        href={absoluteUrl()}
        className="inline-flex items-center gap-2"
      >
        <img
          src={absoluteUrl('/icon.png')}
          alt="Evaluate logo"
          width={36}
          height={36}
        />
        <span className="text-primary font-bold text-xl">Evaluate</span>
      </a>

      <div className="ml-auto">
        <ThemeSwitcher />
        <LocaleSwitcher />
      </div>
    </header>
  );
}
