import { fetchRuntimes } from '@evaluate/engine/runtimes';
import { Suspense } from 'react';
import { generateBaseMetadata } from '~/app/metadata';
import PlaygroundsPageContent from './content';

export function generateMetadata() {
  return generateBaseMetadata('/playgrounds');
}

export default async function PlaygroundsPage() {
  const runtimes = await fetchRuntimes();
  return (
    <Suspense>
      <PlaygroundsPageContent runtimes={runtimes} />
    </Suspense>
  );
}
