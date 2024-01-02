import { Skeleton } from '@evaluate/react/components/skeleton';
import { SkeletonLanguageCard } from './_components/language-card';
import { SkeletonSearchInput } from './_components/search-input';

export default function LoadingPage() {
  return (
    <>
      <div className="py-24 md:py-36 space-y-1">
        <Skeleton
          className="h-10 sm:h-12 md:h-14 w-full"
          style={{ maxWidth: '1000px' }}
        />
        <Skeleton
          className="h-10 sm:h-12 md:h-14 w-full"
          style={{ maxWidth: '700px' }}
        />
        <Skeleton
          className="h-10 sm:h-12 md:h-14 w-full md:hidden"
          style={{ maxWidth: '300px' }}
        />
        <Skeleton
          className="h-10 sm:h-12 md:h-14 w-full sm:hidden"
          style={{ maxWidth: '300px' }}
        />
        <Skeleton
          className="h-10 sm:h-12 md:h-14 w-full sm:hidden"
          style={{ maxWidth: '300px' }}
        />

        <Skeleton className="h-5 md:h-6 w-full" style={{ maxWidth: '700px' }} />
        <Skeleton className="h-5 md:h-6 w-full" style={{ maxWidth: '300px' }} />
        <Skeleton
          className="h-5 md:h-6 w-full sm:hidden"
          style={{ maxWidth: '300px' }}
        />
        <Skeleton
          className="h-5 md:h-6 w-full sm:hidden"
          style={{ maxWidth: '300px' }}
        />
        <Skeleton
          className="h-5 md:h-6 w-full sm:hidden"
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div>
        <Skeleton className="h-8 w-36" />
      </div>

      <SkeletonSearchInput />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {new Array(70).fill(null).map((_, index) => (
          <SkeletonLanguageCard key={String(index)} />
        ))}
      </div>
    </>
  );
}
