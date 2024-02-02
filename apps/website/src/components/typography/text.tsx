import { cn } from '@evaluate/react/utilities/class-name';

export function Anchor(p: React.HTMLProps<HTMLAnchorElement>) {
  return (
    <a
      {...p}
      className={cn('font-medium underline underline-offset-4', p.className)}
    />
  );
}

export function Paragraph(p: React.HTMLProps<HTMLParagraphElement>) {
  return (
    <p
      {...p}
      className={cn('leading-7 [&:not(:first-child)]:mt-6', p.className)}
    />
  );
}

export function Blockquote(p: React.HTMLProps<HTMLQuoteElement>) {
  return (
    <blockquote
      {...p}
      className={cn(
        'mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground',
        p.className,
      )}
    />
  );
}
