'use client';

import type { PartialRuntime } from '@evaluate/engine/runtimes';
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
    return queriedRuntimes.toSorted((a, b) => {
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
    <div className="flex flex-col gap-6 py-6 container">
      <div className="text-center py-24 space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-primary">
          Playgrounds
        </h1>
        <p className="text-sm md:text-base text-balance">
          Explore and run code in different programming languages and runtimes.
          <br />
          <span className="opacity-70">
            Powered by the Piston execution engine.
          </span>
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex w-full relative">
            <SearchIcon className="size-4 opacity-50 absolute left-2 top-[27%]" />

            <Input
              className="absolute inset-0 w-full h-full pl-7"
              placeholder="Search runtime playgrounds..."
              value={search ?? ''}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <XIcon
                role="button"
                className="size-4 opacity-50 absolute right-2 top-[27%] cursor-pointer"
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

        <div className="grid gap-3 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
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
