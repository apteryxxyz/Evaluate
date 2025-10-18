import { fetchAllRuntimes, fetchRuntimeById } from '@evaluate/runtimes';
import { notFound } from 'next/navigation';
import { generateBaseMetadata } from '~/app/[locale]/metadata';

import { Editor } from '~/components/editor';
import { Explorer } from '~/components/explorer';
import { ExplorerProvider } from '~/components/explorer/use';
import { Terminal } from '~/components/terminal';
import { TerminalProvider } from '~/components/terminal/use';
import say from '~/i18n';
import { EditorWrapper } from './wrapper';

export async function generateStaticParams() {
  const runtimes = await fetchAllRuntimes();
  return runtimes.map((r) => ({ playground: r.id }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/playgrounds/[playground]'>) {
  const { locale, playground } = await params;
  const runtime = await fetchRuntimeById(decodeURIComponent(playground));
  if (!runtime) notFound();

  return generateBaseMetadata(
    say.activate(locale),
    `/playgrounds/${playground}`,
    (say) => ({
      title: say`${runtime.name} Online Playground on Evaluate`,
      description: say`Run ${runtime.name} and more code snippets online in your browser with Evaluate's code playground.`,
      keywords: [runtime.name, ...runtime.aliases, ...runtime.tags].map((k) =>
        k.toLowerCase(),
      ),
    }),
  );
}

export default async function EditorPage({
  params,
}: PageProps<'/[locale]/playgrounds/[playground]'>) {
  const { playground } = await params;
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
