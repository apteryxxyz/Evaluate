import { cn } from '@evaluate/react/utilities/class-name';

export function Heading1(p: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h1
      {...p}
      className={cn(
        'mt-2 scroll-m-20 text-4xl font-bold tracking-tight',
        p.className,
      )}
    >
      {p.children}
    </h1>
  );
}

export function Heading2(p: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h2
      {...p}
      className={cn(
        'mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0',
        p.className,
      )}
    >
      {p.children}
    </h2>
  );
}

export function Heading3(p: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h3
      {...p}
      className={cn(
        'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
        p.className,
      )}
    >
      {p.children}
    </h3>
  );
}

export function Heading4(p: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h4
      {...p}
      className={cn(
        'mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
        p.className,
      )}
    >
      {p.children}
    </h4>
  );
}

export function Heading5(p: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h5
      {...p}
      className={cn(
        'mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
        p.className,
      )}
    >
      {p.children}
    </h5>
  );
}

export function Heading6(p: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h6
      {...p}
      className={cn(
        'mt-8 scroll-m-20 text-base font-semibold tracking-tight',
        p.className,
      )}
    >
      {p.children}
    </h6>
  );
}
