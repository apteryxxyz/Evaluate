import { env } from '~env';
import { ThemeSwitcher } from './theme-switcher';

export function HeaderBar() {
  return (
    <header className="h-14 w-full flex items-center">
      <a
        target="_blank"
        rel="noreferrer noopener"
        href={env.PLASMO_PUBLIC_WEBSITE_URL}
        className="inline-flex items-center gap-2"
      >
        <img
          src={`${env.PLASMO_PUBLIC_WEBSITE_URL}/images/icon.png`}
          alt="Evaluate logo"
          width={36}
          height={36}
        />
        <span className="font-bold text-xl text-primary">Evaluate</span>
      </a>

      <div className="ml-auto">
        <ThemeSwitcher />
      </div>
    </header>
  );
}
