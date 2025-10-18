import { fetchAllRuntimes } from '@evaluate/runtimes';
import { Say } from '@sayable/react';
import say from '~/i18n';
import type { PageProps } from '~/types';
import { generateBaseMetadata } from '../../metadata';
import { PlaygroundCardList } from './playground-card-list';

export async function generateMetadata(props: PageProps<['[locale]']>) {
  const { locale } = await props.params;
  return generateBaseMetadata(say.activate(locale), '/playgrounds');
}

export default async function PlaygroundsPage() {
  const runtimes = await fetchAllRuntimes();

  return (
    <div className="container flex flex-col gap-6 py-6">
      <div className="space-y-6 py-24 text-center">
        <h1 className="font-bold text-3xl text-primary tracking-tight md:text-5xl">
          <Say>Playgrounds</Say>
        </h1>
        <p className="text-balance text-sm md:text-base">
          <Say>
            Explore and run code in different programming languages and
            runtimes.
          </Say>
          <br />
          <span className="opacity-70">
            <Say>Powered by the Piston execution engine.</Say>
          </span>
        </p>
      </div>

      <PlaygroundCardList initialRuntimes={runtimes} />
    </div>
  );
}
