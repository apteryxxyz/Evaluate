import { cn } from '@evaluate/react/utilities/class-name';

export function UnorderedList(p: React.HTMLProps<HTMLUListElement>) {
  return <ul {...p} className={cn('my-6 ml-6 list-disc', p.className)} />;
}

export function OrderedList(p: React.HTMLProps<HTMLOListElement>) {
  // @ts-ignore
  return <ol {...p} className={cn('my-6 ml-6 list-decimal', p.className)} />;
}

export function ListItem(p: React.HTMLProps<HTMLLIElement>) {
  return <li {...p} className={cn('mt-2', p.className)} />;
}
