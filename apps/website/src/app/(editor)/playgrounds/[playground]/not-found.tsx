import { Button } from '@evaluate/react/components/button';
import Link from 'next/link';

export default function PlaygroundNotFound() {
  return (
    <div className="flex flex-col mt-[20vh] items-center justify-center">
      <span className="text-8xl font-bold">404</span>
      <h1 className="text-4xl font-bold text-primary">Not Found</h1>
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
