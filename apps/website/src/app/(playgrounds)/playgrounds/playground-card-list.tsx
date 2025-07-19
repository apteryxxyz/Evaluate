'use client';

import { Input } from '@evaluate/components/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@evaluate/components/select';
import { Separator } from '@evaluate/components/separator';
import { toast } from '@evaluate/components/toast';
import type { Runtime } from '@evaluate/runtimes';
import {
  ArrowDownWideNarrowIcon,
  CircleDotIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { useDeferredValue, useEffect, useMemo } from 'react';
import { useHashFragment } from '~/hooks/hash-fragment';
import { useLocalStorage } from '~/hooks/local-storage';
import { useQueryParameter } from '~/hooks/query-parameter';
import { PlaygroundCard } from './playground-card';

export function PlaygroundCardList({
  initialRuntimes,
}: {
  initialRuntimes: Runtime[];
}) {
  const [search, setSearch] = useQueryParameter('search');
  const deferredSearch = useDeferredValue(search);
  const searchedRuntimes = useMemo(() => {
    if (!deferredSearch) return initialRuntimes;

    return initialRuntimes.filter((runtime) => {
      if (runtime.name.toLowerCase().includes(deferredSearch.toLowerCase()))
        return true;
      if (
        runtime.aliases.some((alias) =>
          alias.toLowerCase().includes(deferredSearch.toLowerCase()),
        )
      )
        return true;
      if (
        runtime.tags.some((tag) =>
          tag.toLowerCase().includes(deferredSearch.toLowerCase()),
        )
      )
        return true;
      return false;
    });
  }, [initialRuntimes, deferredSearch]);

  type SortBy = 'popularity' | 'name';
  const [sortBy, setSortBy] = useQueryParameter<SortBy>('sort', 'popularity');
  const sortedRuntimes = useMemo(() => {
    return searchedRuntimes.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.popularity - a.popularity;
    });
  }, [searchedRuntimes, sortBy]);

  const [pinnedRuntimeIds] = useLocalStorage<string[]>('evaluate.pinned', []);
  const pinnedRuntimes = useMemo(() => {
    return pinnedRuntimeIds
      .map((id) => initialRuntimes.find((r) => r.id === id)!)
      .filter(Boolean);
  }, [pinnedRuntimeIds, initialRuntimes]);

  const [hash] = useHashFragment();
  useEffect(() => {
    if (hash)
      toast.info('Choose a playground!', {
        icon: <CircleDotIcon className="size-4" />,
      });
  }, [hash]);

  return (
    <div className="space-y-3">
      <search className="flex gap-3">
        <div className="relative flex w-full">
          <SearchIcon className="absolute top-[27%] left-2 size-4 opacity-50" />

          <Input
            className="absolute inset-0 h-full w-full pl-7"
            placeholder="Search runtime playgrounds..."
            value={search ?? ''}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <XIcon
              role="button"
              className="absolute top-[27%] right-2 size-4 cursor-pointer opacity-50"
              onClick={() => setSearch('')}
            >
              <span className="sr-only">Clear Search</span>
            </XIcon>
          )}
        </div>

        <Select value={sortBy} onValueChange={setSortBy as never}>
          <SelectTrigger className="w-[205px]" icon={ArrowDownWideNarrowIcon}>
            <SelectValue placeholder="Sort by..." />
            <span className="sr-only">Toggle Sort By Dropdown</span>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </search>

      {pinnedRuntimes.length > 0 && (
        <>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {pinnedRuntimes.map((runtime) => (
              <PlaygroundCard
                key={runtime.id}
                runtime={runtime}
                hash={hash || undefined}
              />
            ))}
          </div>
          <Separator />
        </>
      )}

      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {sortedRuntimes.map((runtime) => (
          <PlaygroundCard
            key={runtime.id}
            runtime={runtime}
            hash={hash || undefined}
          />
        ))}
      </div>
    </div>
  );
}
