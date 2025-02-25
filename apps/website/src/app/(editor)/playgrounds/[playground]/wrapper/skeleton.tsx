import { Skeleton } from '@evaluate/components/skeleton';
import { twMerge as cn } from 'tailwind-merge';

export function EditorWrapperSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-[calc(-3.5rem_+_100vh_-_12px)] lg:h-[calc(-3.5rem_+_100vh_-_6px)]',
        className,
      )}
    >
      <Skeleton className="m-1.5 hidden w-[15vw] rounded-xl border-2 bg-card lg:block" />
      <Skeleton className="m-1.5 w-[55vw] rounded-xl border-2 bg-card" />
      <Skeleton className="m-1.5 hidden w-[30vw] rounded-xl border-2 bg-card lg:block" />
    </div>
  );
}
