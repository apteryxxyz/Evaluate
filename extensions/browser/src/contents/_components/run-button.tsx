import { ExecuteCodeResult, executeCode } from '@evaluate/execute';
import { Language, findLanguage } from '@evaluate/languages';
import { Button } from '@evaluate/react/components/button';
import { cn } from '@evaluate/react/utilities/class-name';
import { Loader2Icon, PlayIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { analytics } from '~contexts/analytics';
import { LanguageDialog } from './language-dialog';
import { ResultDialog } from './result-dialog';

export function RunButton(p: {
  preElement: HTMLPreElement;
  dialogRef: React.RefObject<HTMLDivElement>;
}) {
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

    analytics.capture('code executed', {
      'language id': language.id,
      'code length': code.length,
      'output length': output.length,
      'input provided': false,
      'arguments provided': false,
      'was successful':
        result.run.success && (!result.compile || result.compile.success),
    });
  }, [isExecuting, language, code]);

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
        {isLoading || isExecuting ? (
          <Loader2Icon className="animate-spin w-5 h-5" />
        ) : !code && !language ? (
          <XIcon className="w-5 h-5" />
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

  for (const element of possibleElements) {
    const dataLanguage = element.getAttribute('data-language');
    const matchedLanguage = element.className.match(/language-([a-z]+)/)?.[0];

    if (dataLanguage) {
      const language = await findLanguage(dataLanguage);
      if (language) return language;
    }
    if (matchedLanguage) {
      const language = await findLanguage(matchedLanguage);
      if (language) return language;
    }
  }

  for (const name of possibleElements.flatMap((e) =>
    e.className.split(/ |-/),
  )) {
    if (!name) continue;
    const language = await findLanguage(name);
    if (language) return language;
  }

  return null;
}
