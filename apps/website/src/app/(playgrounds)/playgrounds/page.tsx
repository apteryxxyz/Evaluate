import { fetchRuntimes } from '@evaluate/engine/runtimes';
import { generateBaseMetadata } from '~/app/metadata';
import { PlaygroundCardList } from './playground-card-list';

export function generateMetadata() {
  return generateBaseMetadata('/playgrounds');
}

export default async function PlaygroundsPage() {
  const runtimes = await fetchRuntimes();

  return (
    <div className="container flex flex-col gap-6 py-6">
      <div className="space-y-6 py-24 text-center">
        <h1 className="font-bold text-3xl text-primary tracking-tight md:text-5xl">
          Playgrounds
        </h1>
        <p className="text-balance text-sm md:text-base">
          Explore and run code in different programming languages and runtimes.
          <br />
          <span className="opacity-70">
            Powered by the Piston execution engine.
          </span>
        </p>
      </div>

      <PlaygroundCardList initialRuntimes={runtimes} />
    </div>
  );
}
