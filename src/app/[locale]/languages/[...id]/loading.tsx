import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <>
      <div className="space-y-1">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-7 w-40" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-14" />
          </div>

          <Skeleton className="h-60 w-full" />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="space-y-2 w-full">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="w-full h-[80px]" />
          </div>

          <div className="space-y-2 w-full">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="w-full h-[80px]" />
          </div>
        </div>

        <Skeleton className="ml-auto h-9 w-20" />
      </div>

      <div className="space-y-2 w-full">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="w-full h-[80px]" />
      </div>
    </>
  );
}
