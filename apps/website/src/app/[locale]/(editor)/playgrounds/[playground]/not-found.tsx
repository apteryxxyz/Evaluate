import { Button } from '@evaluate/components/button';
import { Say } from '@sayable/react';
import { LocalisedLink } from '~/components/localised-link';

export default function PlaygroundNotFound() {
  return (
    <div className="mt-[20vh] flex flex-col items-center justify-center">
      <span className="font-bold text-8xl">404</span>
      <h1 className="font-bold text-4xl text-primary">
        <Say>Not Found</Say>
      </h1>
      <p className="text-balance text-center text-muted-foreground">
        <Say>Hmm, we couldn't find the playground you're looking for.</Say>
      </p>

      <div className="mt-2">
        <Button variant="secondary" asChild>
          <LocalisedLink href="/playgrounds">
            <Say>Browse Playgrounds</Say>
          </LocalisedLink>
        </Button>
      </div>
    </div>
  );
}
