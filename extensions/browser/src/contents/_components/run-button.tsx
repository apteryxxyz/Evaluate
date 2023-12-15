import {
  ExecuteCodeResult,
  Language,
  executeCode,
  findLanguage,
  formatLanguageName,
} from '@evaluate/execute';
import { cn } from '@evaluate/ui';
import { Button } from '@evaluate/ui/button';
import { Loader2Icon, PlayIcon, XIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ResultDialog } from './result-dialog';

export function RunButton(p: {
  preElement: HTMLPreElement;
  dialogRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [cannotRun, setCannotRun] = useState(false);
  const [language, setLanguage] = useState<Language>();
  const [result, setResult] = useState<ExecuteCodeResult>();

  const onClick = useCallback(async () => {
    if (isExecuting) return;
    setIsExecuting(true);

    const language = await getLanguageFromElement(p.preElement);
    if (!language) {
      // TODO: Maybe redirect to the website and show a sort of onboarding
      // screen where the user can choose the language
      setCannotRun(true);
      setIsExecuting(false);
      return;
    }

    const code = p.preElement.textContent;
    if (!code) {
      setCannotRun(true);
      setIsExecuting(false);
      return;
    }

    setLanguage(language);
    return executeCode({ language, files: [{ content: code }] })
      .then((result) => setResult(result))
      .finally(() => setIsExecuting(false));
  }, [isExecuting, p.preElement]);

  return (
    <>
      <Button
        size="icon"
        className={cn(
          'aspect-square rounded-full m-2 w-7 h-7',
          cannotRun && 'bg-red-500 hover:bg-red-600',
        )}
        onClick={onClick}
        disabled={isExecuting || cannotRun}
      >
        {cannotRun ? (
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

  for (const name of [...names.map(formatLanguageName), ...names]) {
    const language = await findLanguage(name);
    if (language) return language;
  }

  return null;
}
