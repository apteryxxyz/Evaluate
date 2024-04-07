import { fetchRuntimes, getRuntime } from '@evaluate/engine/runtimes';
import { notFound } from 'next/navigation';
import { generateBaseMetadata } from '~/app/metadata';
import type { PageProps } from '~/types';
import EditorContent from './content';

export async function generateStaticParams() {
  const runtimes = await fetchRuntimes();
  return runtimes

    .reduce<string[]>((ids, runtime) => {
      for (const version of runtime.versions)
        ids.push(`${runtime.id}@${version}`);
      ids.push(runtime.id);
      return ids;
    }, [])
    .map((id) => ({ runtime: id }));
}

export async function generateMetadata(p: PageProps<['playground']>) {
  const id = decodeURIComponent(p.params.playground);
  const runtime = await getRuntime(id);
  if (!runtime) notFound();

  return generateBaseMetadata(`/playground/${id}`, {
    title: `${runtime.name} Playground on Evaluate`,
    description: `Run code in ${runtime.name} and other programming languages effortlessly with Evaluate. Provide your source code, optional input, and command line arguments to receive instant outputs. Debug, optimise, and enhance your coding process by running ${runtime.name} code and exploring various languages. Elevate your programming experience with Evaluate's versatile code evaluation capabilities.`,
  });
}

export default async function PlaygroundEditorPage(
  p: PageProps<['playground']>,
) {
  const id = decodeURIComponent(p.params.playground);
  const runtime = await getRuntime(id);
  if (!runtime) notFound();

  return (
    <>
      <style>{`
        body{overflow-y:hidden!important;}
        body[data-scroll-locked]{margin-right: 0px !important;}
      `}</style>
      <EditorContent runtime={{ ...runtime }} />
    </>
  );
}
