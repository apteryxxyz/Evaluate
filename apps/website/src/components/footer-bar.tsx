import { cn } from '@evaluate/react/utilities/class-name';
import Link from 'next/link';

export function FooterBar(p: { className?: string }) {
  return (
    <footer
      className={cn(
        'flex flex-col items-center justify-center pb-8 text-sm text-foreground/20',
        p.className,
      )}
    >
      <p>
        <Link
          href="/policies/privacy-policy"
          className="hover:text-foreground/40 duration-200"
        >
          Privacy Policy
        </Link>
        <span className="mx-2">•</span>
        <Link
          href="/policies/terms-of-service"
          className="hover:text-foreground/40 duration-200"
        >
          Terms of Service
        </Link>
      </p>
    </footer>
  );
}
