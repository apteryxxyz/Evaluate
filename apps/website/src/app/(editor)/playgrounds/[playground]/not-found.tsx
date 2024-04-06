import { Button } from '@evaluate/react/components/button';
import Link from 'next/link';

export default function PlaygroundNotFound() {
  return (
    <div className="mt-[20vh] flex flex-col items-center justify-center">
      <span className="font-bold text-8xl">404</span>
      <h1 className="font-bold text-4xl text-primary">Not Found</h1>
      <p className="text-balance text-center text-muted-foreground">
        Hmm, we couldn't find the playground you're looking for.
      </p>

      <div className="mt-2">
        <Button variant="secondary" asChild>
          <Link href="/playgrounds">Browse Playgrounds</Link>
        </Button>
      </div>
    </div>
  );
}
