import { Toaster, toast } from '@evaluate/components/dist/toast';
import { compress } from '@evaluate/engine/dist/compress';
import type { ExecuteResult, PartialRuntime } from '@evaluate/types';
import { AnimatePresence, motion } from 'framer-motion';
import type { PlasmoCSConfig, PlasmoGetStyle } from 'plasmo';
import { useCallback, useEffect, useState } from 'react';
import { env } from '~env';
import { ResultsCard } from './_components/results-dialog';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

// @ts-ignore
import sonnerCss from 'data-text:~styles/sonner.css';
// @ts-ignore
import themeCss from 'data-text:~styles/theme.css';
import { wrapCapture } from '~services/analytics';
export const getStyle: PlasmoGetStyle = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.setAttribute('added-by-extension', 'evaluate');
  link.href =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);

  const style = document.createElement('style');
  style.setAttribute('added-by-extension', 'evaluate');
  style.textContent = themeCss.replaceAll(':root', ':host');
  style.textContent += `\n\n${sonnerCss}`;
  return style;
};

export default function Dialog() {
  const [children, setChildren] = useState<React.ReactNode>();
  const onClose = useCallback(() => setChildren(undefined), []);

  useEffect(() => {
    let toastId: string | number;

    chrome.runtime.onMessage.addListener((message) => {
      if (message.subject === 'executionStarted') {
        const runtimes = message.runtimes as PartialRuntime[];
        return (toastId = toast.loading(
          'Executing code, this may take a few seconds...',
          {
            description:
              runtimes.length > 1
                ? `Running in ${runtimes.length} runtimes for the best results.`
                : `Running in ${runtimes[0]!.name}.`,
          },
        ));
      }

      //

      if (message.subject === 'showResults') {
        toast.dismiss(toastId);
        const code = message.code as string;
        const results = //
          message.results as (ExecuteResult & { runtime: PartialRuntime })[];
        return setChildren(
          <ResultsCard code={code} results={results} onClose={onClose} />,
        );
      }

      //

      if (message.subject === 'unknownRuntime') {
        const code = message.code as string;
        const state = compress({
          files: { 'file.code': code },
          entry: 'file.code',
        });
        const url = `${env.PLASMO_PUBLIC_WEBSITE_URL}/playgrounds#${state}`;
        return toast.error('Could not determine language', {
          description:
            'Evaluate was unable to determine the language of the selected text.',
          action: {
            label: 'Open in Evaluate',
            onClick: wrapCapture(() => window.open(url, '_blank')),
          },
        });
      }
    });
  }, [onClose]);

  return (
    <main className="dark" style={{ fontFamily: 'Inter, Ariel' }}>
      <div
        style={{ maxHeight: '95dvh' }}
        className="dark fixed text-black dark:text-white"
      >
        <AnimatePresence>
          {children && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Toaster theme="dark" />
    </main>
  );
}
