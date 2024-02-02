import { cn } from '@evaluate/react/utilities/class-name';

export function Pre(p: React.HTMLProps<HTMLPreElement>) {
  return (
    <pre
      {...p}
      className={cn(
        'mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4',
        p.className,
      )}
    />
  );
}

export function Code(p: React.HTMLProps<HTMLElement>) {
  return (
    <code
      {...p}
      className={cn(
        'relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm',
        p.className,
      )}
    />
  );
}
