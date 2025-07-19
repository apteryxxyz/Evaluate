import { fetchAllRuntimes, fetchRuntimeById } from '@evaluate/runtimes';
import { notFound } from 'next/navigation';
import { generateBaseMetadata } from '~/app/metadata';
import { Editor } from '~/components/editor';
import { Explorer } from '~/components/explorer';
import { ExplorerProvider } from '~/components/explorer/use';
import { Terminal } from '~/components/terminal';
import { TerminalProvider } from '~/components/terminal/use';
import type { PageProps } from '~/types';
import { EditorWrapper } from './wrapper';

export async function generateStaticParams() {
  const runtimes = await fetchAllRuntimes();
  return runtimes.map((r) => ({ playground: r.id }));
}

export async function generateMetadata(props: PageProps<['[playground]']>) {
  const playground = (await props.params).playground;
  const runtime = await fetchRuntimeById(decodeURIComponent(playground));
  if (!runtime) notFound();

  return generateBaseMetadata(`/playground/${playground}`, {
    title: `${runtime.name} Playground on Evaluate`,
    description: `Run code in ${runtime.name} and other programming languages effortlessly with Evaluate. Input your code, optional arguments, and get instant results. Debug, optimize, and elevate your coding experience with our versatile evaluation tools.`,
    keywords: [runtime.name, ...runtime.aliases, ...runtime.tags] //
      .map((k) => k.toLowerCase()),
  });
}

export default async function EditorPage(props: PageProps<['[playground]']>) {
  const playground = (await props.params).playground;
  const runtime = await fetchRuntimeById(decodeURIComponent(playground));
  if (!runtime) notFound();

  return (
    <>
      <style>{`
        body{overflow-y:hidden!important;}
        body[data-scroll-locked]{margin-right:0px!important;}
      `}</style>
      <div className="m-1.5 mt-0 h-[calc(-3.5rem_+_100vh_-_12px)] lg:h-[calc(-3.5rem_+_100vh_-_6px)]">
        <ExplorerProvider runtime={runtime}>
          <TerminalProvider>
            <EditorWrapper>
              <Explorer />
              <Editor runtime={runtime} />
              <Terminal runtime={runtime} />
            </EditorWrapper>
          </TerminalProvider>
        </ExplorerProvider>
      </div>
    </>
  );
}
