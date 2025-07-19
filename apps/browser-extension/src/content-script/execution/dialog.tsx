import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@evaluate/components/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@evaluate/components/tabs';
import type { ExecuteResult } from '@evaluate/execute';
import type { Runtime } from '@evaluate/runtimes';
import browser from 'webextension-polyfill';
import env from '~/env';
import { ResultDialog } from './result';

export function ExecutionDialog({
  portal,
  code,
  runtimes,
  results,
  setResults,
}: {
  portal: HTMLElement;
  code: string;
  runtimes: Runtime[];
  results: ExecuteResult[];
  setResults: (results: ExecuteResult[]) => void;
}) {
  const open = results.length > 0;
  const onClose = () => setResults([]);
  const successIndex = results.findIndex((r) => r.run?.code === 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogBody portalProps={{ container: portal }} className="border-2">
        <DialogHeader className="flex-row">
          <img
            src={browser.runtime.getURL('images/icon.png')}
            alt="Evaluate logo"
            width={36}
            height={36}
          />
          <DialogTitle className="text-primary" asChild>
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={`${env.VITE_PUBLIC_WEBSITE_URL}`}
            >
              Evaluate
            </a>
          </DialogTitle>
        </DialogHeader>

        <DialogContent>
          {results.length > 0 && (
            <Tabs defaultValue={runtimes[~successIndex ? successIndex : 0]?.id}>
              <TabsList className="w-full">
                {runtimes.map((runtime) => (
                  <TabsTrigger key={runtime.id} value={runtime.id}>
                    {runtime.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {runtimes.map((runtime, i) => (
                <TabsContent key={runtime.id} value={runtime.id}>
                  <ResultDialog
                    options={{ code }}
                    runtime={runtime}
                    result={results[i]!}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </DialogContent>
      </DialogBody>
    </Dialog>
  );
}
