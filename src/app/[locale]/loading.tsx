'use client';

import { SkeletonLanguageCard } from '@/components/language-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <>
      <div>
        <Skeleton className="h-8 w-36" />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {[...(new Array(70) as unknown[])].map((_, index) => (
          <SkeletonLanguageCard key={index} />
        ))}
      </div>
    </>
  );
}
