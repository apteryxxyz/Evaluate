'use client';

import type { PartialRuntime } from '@evaluate/types';
import { Input } from '@evaluate/react/components/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@evaluate/react/components/select';
import { toast } from '@evaluate/react/components/toast';
import Fuse from 'fuse.js';
import {
  ArrowDownWideNarrowIcon,
  CircleDotIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { useDeferredValue, useEffect, useMemo } from 'react';
import { useHashFragment } from '~/hooks/use-hash-fragment';
import { useQueryParameter } from '~/hooks/use-query-parameter';
import { PlaygroundCard } from './_components/playground-card';

export default function PlaygroundsPageContent(p: {
  runtimes: PartialRuntime[];
}) {
  const [search, setSearch] = useQueryParameter('search');
  const deferredSearch = useDeferredValue(search);

  const queriedRuntimes = useMemo(() => {
    if (!deferredSearch) return p.runtimes;
    const engine = new Fuse(p.runtimes, {
      keys: ['name', 'aliases', 'tags'],
      threshold: 0.3,
    });
    return engine.search(deferredSearch).map((result) => result.item);
  }, [p.runtimes, deferredSearch]);

  type SortBy = 'popularity' | 'name';
  const [sortBy, setSortBy] = useQueryParameter<SortBy>('sort', 'popularity');
  const sortedRuntimes = useMemo(() => {
    return queriedRuntimes.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.popularity - a.popularity;
    });
  }, [queriedRuntimes, sortBy]);

  const [hash] = useHashFragment();
  useEffect(() => {
    if (hash)
      toast.info('Choose a playground!', {
        icon: <CircleDotIcon className="size-4" />,
      });
  }, [hash]);

  return (
    <div className="container flex flex-col gap-6 py-6">
      <div className="space-y-6 py-24 text-center">
        <h1 className="font-bold text-3xl text-primary tracking-tight md:text-5xl">
          Playgrounds
        </h1>
        <p className="text-balance text-sm md:text-base">
          Explore and run code in different programming languages and runtimes.
          <br />
          <span className="opacity-70">
            Powered by the Piston execution engine.
          </span>
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
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
        </div>

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
    </div>
  );
}
