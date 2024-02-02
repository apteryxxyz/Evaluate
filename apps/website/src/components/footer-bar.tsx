import Link from 'next/link';

export function FooterBar() {
  return (
    <footer className="flex flex-shrink-0 flex-col items-center justify-center pb-8 text-sm text-foreground/20">
      {/* <p>
        Made by{' '}
        <a
          className="hover:text-foreground/40 duration-200"
          href="https://apteryx.xyz/"
          target="_blank"
          rel="noreferrer"
        >
          Apteryx
        </a>{' '}
        in New Zealand
      </p> */}

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
