'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguages } from '@/contexts/languages';
import { useLocale } from '@/contexts/locale';
import { useTranslate } from '@/contexts/translate';
import { addLocale } from '@/utilities/url-helpers';
import { IdentifyCodeButton } from './identify-code-button';
import { LanguageSearchBar } from './language-search-bar';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeSwitcher } from './theme-switcher';
import { Button } from './ui/button';

export function HeaderBar() {
  const t = useTranslate();
  const locale = useLocale();
  const languages = useLanguages();

  return (
    <header className="container flex flex-col lg:flex-row gap-4 justify-between">
      <nav className="flex flex-wrap gap-4">
        <Link
          href={addLocale('/', locale)}
          className="flex items-center gap-2"
          onClick={() => languages.setFiltered(languages.initial)}
        >
          <Image
            src="https://japi.rest/discord/v1/user/946755134443102258/avatar"
            alt="evaluate logo"
            width={36}
            height={36}
          />
          <span className="text-primary font-bold text-xl">Evaluate</span>
        </Link>

        <div className="flex gap-2">
          <IdentifyCodeButton />

          <a href="/bot" target="_blank" rel="noreferrer noopener">
            <Button variant="outline">{t.discord_bot()}</Button>
          </a>
        </div>
      </nav>

      <div className="flex gap-2">
        <LocaleSwitcher />
        <ThemeSwitcher />
        <LanguageSearchBar />
      </div>
    </header>
  );
}
