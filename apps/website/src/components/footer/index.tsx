'use client';

import { cn } from '@evaluate/helpers/class';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer(p: { className?: string }) {
  const pathname = usePathname();
  const isFullWidth = pathname.startsWith('/playgrounds/');

  return (
    <footer
      className={cn(
        'flex flex-col items-center justify-center pb-8 text-foreground/50 text-xs',
        isFullWidth &&
          'absolute bottom-0 left-0 w-full pb-2 text-foreground/10 lg:pb-4',
        p.className,
      )}
    >
      <p>
        <Link
          href="/policies/privacy-policy"
          className="duration-200 hover:text-foreground/60"
        >
          Privacy Policy
        </Link>
        <span className="mx-2">•</span>
        <Link
          href="/policies/terms-of-service"
          className="duration-200 hover:text-foreground/60"
        >
          Terms of Service
        </Link>
      </p>
    </footer>
  );
}
