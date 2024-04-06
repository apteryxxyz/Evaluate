import { cn } from '@evaluate/react/utilities/class-name';
import Link from 'next/link';

export function Footer(p: { className?: string }) {
  return (
    <footer
      className={cn(
        'flex flex-col items-center justify-center pb-8 text-foreground/50 text-sm',
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
