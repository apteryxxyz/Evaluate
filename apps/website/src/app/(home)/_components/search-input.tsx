'use client';

import { searchLanguages } from '@evaluate/execute';
import { Button } from '@evaluate/react/components/button';
import { Input } from '@evaluate/react/components/input';
import { useEventListener } from '@evaluate/react/hooks/event-listener';
import { useHotKeys } from '@evaluate/react/hooks/hot-keys';
import { Loader2Icon, SearchIcon } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { useLanguages } from '~/contexts/languages';
import { useTranslate } from '~/contexts/translate';

export function SearchInput() {
  const t = useTranslate();

  const inputRef = useRef<HTMLInputElement>(null);
  const { languages, isSearching, setIsSearching, setFilteredLanguages } =
    useLanguages();

  const onClick = useCallback(() => {
    // TIL we don't need useState where we're going
    const query = inputRef.current?.value ?? '';

    // If the input is empty, reset the filtered languages
    if (!query.trim()) return setFilteredLanguages(languages);

    if (isSearching) return;
    setIsSearching(true);

    return searchLanguages(query)
      .then(setFilteredLanguages)
      .finally(() => setIsSearching(false));
  }, [isSearching, languages, setIsSearching, setFilteredLanguages]);

  // Listen for when the user presses enter while focused on the input
  // and trigger the search button
  useEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      inputRef.current?.blur();
      onClick();
    },
    inputRef,
  );

  // Listen for when the user presses ctrl+f or / and focus the input
  useHotKeys(
    ['ctrl+f', '/'], //
    () => inputRef.current?.focus(),
    { preventDefault: true },
  );

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        placeholder={t.languages.search.description()}
        className="bg-transparent duration-300 hover:border-primary bg-glow"
      />

      <Button
        type="button"
        className="md:w-32"
        onClick={onClick}
        disabled={isSearching}
      >
        {isSearching ? (
          <>
            <Loader2Icon className="h-4 w-4 animate-spin" />
            <span className="hidden md:block">
              &nbsp;{t.languages.search.ing()}
            </span>
          </>
        ) : (
          <>
            <SearchIcon className="h-4 w-4" />
            <span className="hidden md:block">
              &nbsp;{t.languages.search()}
            </span>
          </>
        )}
      </Button>
    </div>
  );
}
