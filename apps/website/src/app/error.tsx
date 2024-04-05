'use client';

export default function PlaygroundNotFound() {
  return (
    <div className="flex flex-col mt-[20vh] items-center justify-center">
      <span className="text-8xl font-bold">500</span>
      <h1 className="text-4xl font-bold text-primary">Internal Error</h1>
      <p className="text-balance text-center text-muted-foreground">
        Woah, something went wrong, please try again later.
      </p>
    </div>
  );
}
