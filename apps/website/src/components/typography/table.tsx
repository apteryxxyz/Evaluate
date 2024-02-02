import { cn } from '@evaluate/react/utilities/class-name';

export function Table(p: React.HTMLProps<HTMLTableElement>) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table {...p} className={cn('w-full', p.className)} />
    </div>
  );
}

export function TableRow(p: React.HTMLProps<HTMLTableRowElement>) {
  return (
    <tr {...p} className={cn('m-0 border-t p-0 even:bg-muted', p.className)} />
  );
}

export function TableHeader(p: React.HTMLProps<HTMLTableCellElement>) {
  return (
    <th
      {...p}
      className={cn(
        'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        p.className,
      )}
    />
  );
}

export function TableData(p: React.HTMLProps<HTMLTableCellElement>) {
  return (
    <td
      {...p}
      className={cn(
        'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
        p.className,
      )}
    />
  );
}
