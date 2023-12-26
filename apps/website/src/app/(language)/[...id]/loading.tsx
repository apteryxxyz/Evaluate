import { Skeleton } from '@evaluate/ui/skeleton';

export default function LanguageLoading() {
  return (
    <>
      <div className="flex gap-1 items-end">
        <Skeleton className="h-8 w-32 mr-1" />
        <Skeleton className="h-6 w-28" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-14" />
          </div>

          <Skeleton className="h-72 w-full" />
        </div>

        <div className="my-3">
          <Skeleton className="h-5 w-28" />
        </div>

        <div className="space-y-1">
          <Skeleton className="ml-auto h-9 w-32" />
          <Skeleton className="ml-auto w-20 h-4" />
        </div>
      </div>

      <div className="space-y-2 w-full">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="w-full h-[80px]" />
      </div>
    </>
  );
}
