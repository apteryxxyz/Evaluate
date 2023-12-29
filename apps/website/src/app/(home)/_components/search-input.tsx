'use client';

import { searchLanguages } from '@evaluate/execute';
import { Button } from '@evaluate/react/components/button';
import { Input } from '@evaluate/react/components/input';
import { useEventListener } from '@evaluate/react/hooks/event-listener';
import { useHotKeys } from '@evaluate/react/hooks/hot-keys';
import { ListRestartIcon, Loader2Icon, SearchIcon } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { useLanguages } from '~/contexts/languages';
import { useTranslate } from '~/contexts/translate';

export function SearchInput() {
  const t = useTranslate();

  const inputRef = useRef<HTMLInputElement>(null);
  const {
    languages,
    filteredLanguages,
    isSearching,
    setIsSearching,
    setFilteredLanguages,
  } = useLanguages();

  const onClick = useCallback(() => {
    if (isSearching) return;
    setIsSearching(true);

    // TIL we don't need useState where we're going
    const query = inputRef.current?.value ?? '';

    try {
      // If the input is empty, reset the filtered languages
      if (!query.trim()) return setFilteredLanguages(languages);
      else return searchLanguages(query).then(setFilteredLanguages);
    } catch {
    } finally {
      setIsSearching(false);

      // Scroll to the top of the languages list
      const scrollAnchor = inputRef.current?.parentElement?.children[0];
      scrollAnchor?.scrollIntoView({ behavior: 'smooth' });
    }
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
    <div className="relative flex gap-2">
      {/* An anchor intended to define the position to scroll to when search */}
      <div className="h-1 bg-transparent absolute top-[-80px]" />

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
            <Loader2Icon size={16} className="animate-spin" />
            <span className="hidden md:block">
              &nbsp;{t.languages.search.ing()}
            </span>
          </>
        ) : (
          <>
            <SearchIcon size={16} />
            <span className="hidden md:block">
              &nbsp;{t.languages.search()}
            </span>
          </>
        )}
      </Button>

      <Button
        size="icon"
        className="aspect-square"
        disabled={languages.length === filteredLanguages.length}
        onClick={() => setFilteredLanguages(languages)}
      >
        <ListRestartIcon size={16} />
        <span className="sr-only">{t.screen_reader.clear_search()}</span>
      </Button>
    </div>
  );
}
