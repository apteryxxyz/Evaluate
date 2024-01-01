import {
  ExecuteCodeResult,
  Language,
  executeCode,
  findLanguage,
  resolveLanguageName,
} from '@evaluate/execute';
import { Button } from '@evaluate/react/components/button';
import { cn } from '@evaluate/react/utilities/class-name';
import { Loader2Icon, PlayIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ResultDialog } from './result-dialog';

export function RunButton(p: {
  preElement: HTMLPreElement;
  dialogRef: React.RefObject<HTMLDivElement>;
}) {
  const [language, setLanguage] = useState<Language>();
  const [code, setCode] = useState<string>();
  const canRun = !!language && !!code;

  useEffect(() => {
    getLanguageFromElement(p.preElement)
      .then((language) => setLanguage(language!))
      .then(() => setCode(p.preElement.textContent ?? ''))
      .catch(() => {});
  }, [p.preElement]);

  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecuteCodeResult>();

  const onClick = useCallback(async () => {
    if (isExecuting || !language || !code) return;
    setIsExecuting(true);

    return executeCode({ language, files: [{ content: code }] })
      .then((result) => setResult(result))
      .finally(() => setIsExecuting(false));
  }, [isExecuting, language, code]);

  return (
    <>
      <Button
        size="icon"
        className={cn(
          'aspect-square rounded-full m-2 w-7 h-7',
          !canRun && 'bg-red-500 hover:bg-red-600',
        )}
        onClick={onClick}
        disabled={isExecuting || !canRun}
      >
        {/* TODO: Add a tooltip to tell the user why this cannot run */}
        {/* TODO: In the case of 'no language', Add a way for the user to be taken to the website where they can choose the language manually */}
        {/* Maybe instead of a disabled X icon, show a button that will instead open a dialog saying crap with options */}
        {!canRun ? (
          <XIcon className="w-5 h-5" />
        ) : isExecuting ? (
          <Loader2Icon className="animate-spin w-5 h-5" />
        ) : (
          <PlayIcon className="ml-0.5 w-5 h-5" />
        )}
      </Button>

      <ResultDialog
        dialogRef={p.dialogRef}
        language={language}
        result={result}
      />
    </>
  );
}

async function getLanguageFromElement(anchorElement: HTMLPreElement) {
  const possibleElements = [
    ...[anchorElement.parentElement, anchorElement],
    ...Array.from(anchorElement.children),
  ].filter((e): e is HTMLElement => e instanceof HTMLElement);

  const names = possibleElements
    .flatMap((e) => {
      // <pre data-language="typescript" />
      const dataLanguage = e.getAttribute('data-language') ?? '';
      // <pre class="language-typescript" />
      const className = e.className.split(/ |-/);
      return [dataLanguage, ...className];
    })
    .filter((e, i, a) => e && a.indexOf(e) === i);

  for (const name of [...names.map(resolveLanguageName), ...names]) {
    if (!name) continue;
    const language = await findLanguage(name);
    if (language) return language;
  }

  return null;
}
