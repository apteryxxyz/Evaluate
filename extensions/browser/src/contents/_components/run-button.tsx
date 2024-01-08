import { ExecuteCodeResult, executeCode } from '@evaluate/execute';
import {
  Language,
  findLanguage,
  resolveLanguageName,
} from '@evaluate/languages';
import { Button } from '@evaluate/react/components/button';
import { cn } from '@evaluate/react/utilities/class-name';
import { Loader2Icon, PlayIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAnalytics } from '~contexts/analytics';
import { LanguageDialog } from './language-dialog';
import { ResultDialog } from './result-dialog';

export function RunButton(p: {
  preElement: HTMLPreElement;
  dialogRef: React.RefObject<HTMLDivElement>;
}) {
  const analytics = useAnalytics();

  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>();
  const [code, setCode] = useState<string>();

  useEffect(() => {
    getLanguageFromElement(p.preElement)
      .then((language) => setLanguage(language!))
      .then(() => setCode(p.preElement.textContent ?? ''))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [p.preElement]);

  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecuteCodeResult>();

  const [resultOpen, setIsResultOpen] = useState(false);
  const [languageOpen, setIsLanguageOpen] = useState(false);

  const onRunClick = useCallback(async () => {
    if (isExecuting) return;
    if (code && !language) return setIsLanguageOpen(true);
    if (!code || !language) return;
    setIsExecuting(true);

    const result = await executeCode({ language, files: [{ content: code }] });

    setResult(result);
    setIsResultOpen(true);
    setIsExecuting(false);

    let output;
    if (result.run.success === false) output = result.run.output;
    else if (result.compile?.success === false) output = result.compile.output;
    else output = result.run.output;

    void analytics?.track('code executed', {
      platform: 'browser extension',
      'language id': language.id,
      'was successful':
        result.run.success && (!result.compile || result.compile.success),
      'code length': code.length,
      'output length': output.length,
    });
  }, [analytics, isExecuting, language, code]);

  return (
    <>
      <Button
        size="icon"
        className={cn(
          'aspect-square rounded-full m-2 w-7 h-7',
          (isLoading || (!code && !language)) && 'bg-red-500 hover:bg-red-600',
        )}
        onClick={onRunClick}
        disabled={isExecuting || (!code && !language)}
      >
        {isLoading ? (
          <Loader2Icon className="animate-spin w-5 h-5" />
        ) : !code && !language ? (
          <XIcon className="w-5 h-5" />
        ) : isExecuting ? (
          <Loader2Icon className="animate-spin w-5 h-5" />
        ) : (
          <PlayIcon className="ml-0.5 w-5 h-5" />
        )}
      </Button>

      <ResultDialog
        open={resultOpen}
        onOpenChange={setIsResultOpen}
        dialogRef={p.dialogRef}
        language={language}
        code={code}
        result={result}
      />

      <LanguageDialog
        open={languageOpen}
        onOpenChange={setIsLanguageOpen}
        dialogRef={p.dialogRef}
        code={code}
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
