'use client';

export default function PlaygroundNotFound() {
  return (
    <div className="mt-[20vh] flex flex-col items-center justify-center">
      <span className="font-bold text-8xl">500</span>
      <h1 className="font-bold text-4xl text-primary">Internal Error</h1>
      <p className="text-balance text-center text-muted-foreground">
        Woah, something went wrong, please try again later.
      </p>
    </div>
  );
}
