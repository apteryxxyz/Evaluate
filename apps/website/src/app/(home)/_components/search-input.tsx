'use client';

import { searchLanguages } from '@evaluate/execute';
import { Button } from '@evaluate/react/components/button';
import { Input } from '@evaluate/react/components/input';
import { Skeleton } from '@evaluate/react/components/skeleton';
import { useEventListener } from '@evaluate/react/hooks/event-listener';
import { useHotKeys } from '@evaluate/react/hooks/hot-keys';
import { ListRestartIcon, Loader2Icon, SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useLanguages } from '~/contexts/languages';
import { useTranslate } from '~/contexts/translate';
import { useSearchParam } from '../_hooks/use-search-param';

export function SearchInput() {
  const t = useTranslate();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollIntoView = useCallback(() => {
    const scrollAnchor = inputRef.current?.parentElement?.children[0];
    scrollAnchor?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const [query, setQuery] = useSearchParam('q');
  const [data] = useSearchParam('d');
  useEffect(() => {
    if (data || query) {
      if (query) {
        void Reflect.set(inputRef.current!, 'value', query ?? '');
        searchLanguages(query).then(setFilteredLanguages);
      }
      scrollIntoView();
    }
  }, [data, query, scrollIntoView]);

  const {
    isSearching,
    languages,
    filteredLanguages,
    setIsSearching,
    setFilteredLanguages,
  } = useLanguages();

  const onSearchClick = useCallback(() => {
    if (isSearching) return;
    setIsSearching(true);

    try {
      // TIL we don't need useState where we're going
      const query = inputRef.current?.value?.trim() ?? '';
      setQuery(query);
      if (query) {
        searchLanguages(query).then(setFilteredLanguages);
      } else {
        setFilteredLanguages(languages);
      }
    } catch {
    } finally {
      setIsSearching(false);
      scrollIntoView();
    }
  }, [
    isSearching,
    setIsSearching,
    setQuery,
    setFilteredLanguages,
    languages,
    scrollIntoView,
  ]);

  // Listen for when the user presses enter while focused on the input
  // and trigger the search button
  useEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      inputRef.current?.blur();
      onSearchClick();
    },
    inputRef,
  );

  // Listen for when the user presses ctrl+f or / and focus the input
  useHotKeys(
    ['ctrl+f', '/'], //
    () => inputRef.current?.focus(),
    { preventDefault: true },
  );

  if (!t) return <SkeletonSearchInput />;
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
        onClick={onSearchClick}
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
        onClick={() => {
          inputRef.current!.value = '';
          onSearchClick();
        }}
      >
        <ListRestartIcon size={16} />
        <span className="sr-only">{t.screen_reader.clear_search()}</span>
      </Button>
    </div>
  );
}

/*
export function SearchInput() {
  const t = useTranslate();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollToSearchInput = useCallback(() => {
    const scrollAnchor = inputRef.current?.parentElement?.children[0];
    scrollAnchor?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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

    try {
      // TIL we don't need useState where we're going
      const query = inputRef.current?.value?.trim() ?? '';
      const newSearchParams = new URLSearchParams(window.location.search);
      if (query) {
        newSearchParams.set('q', query);
        window.location.search = newSearchParams.toString();
        return searchLanguages(query).then(setFilteredLanguages);
      } else {
        newSearchParams.delete('q');
        window.location.search = newSearchParams.toString();
        return setFilteredLanguages(languages);
      }
    } catch {
    } finally {
      setIsSearching(false);
      scrollToSearchInput();
    }
  }, [
    scrollToSearchInput,
    isSearching,
    languages,
    setIsSearching,
    setFilteredLanguages,
  ]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get('q');
    if (query) {
      inputRef.current!.value = query;
      onClick();
    }

    const data = searchParams.get('d') ?? searchParams.get('data');
    if (data) scrollToSearchInput();
  }, []);

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

  if (!t) return <SkeletonSearchInput />;
  return (
    <div className="relative flex gap-2">
      {/* An anchor intended to define the position to scroll to when search *}
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
        onClick={() => {
          inputRef.current!.value = '';
          onClick();
        }}
      >
        <ListRestartIcon size={16} />
        <span className="sr-only">{t.screen_reader.clear_search()}</span>
      </Button>
    </div>
  );
}
*/

export function SkeletonSearchInput() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-8 md:w-32" />
    </div>
  );
}
