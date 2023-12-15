import { Skeleton } from '@evaluate/ui/skeleton';
import { SkeletonLanguageCard } from './_components/language-card';

export default function LoadingPage() {
  return (
    <>
      <div>
        <Skeleton className="w-36 h-8" />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {new Array(70).fill(null).map((_, index) => (
          <SkeletonLanguageCard key={String(index)} />
        ))}
      </div>
    </>
  );
}
