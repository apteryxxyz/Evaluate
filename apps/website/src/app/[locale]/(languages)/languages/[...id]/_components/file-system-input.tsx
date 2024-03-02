'use client';

import type { ExecuteCodeOptions } from '@evaluate/execute';
import type { Language } from '@evaluate/languages';
import { Button } from '@evaluate/react/components/button';
import { Card, CardHeader } from '@evaluate/react/components/card';
import { HighlightedEditor } from '@evaluate/react/components/code-editor/highlighted-editor';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@evaluate/react/components/dialog';
import {
  FormField,
  FormItem,
  FormLabel,
} from '@evaluate/react/components/form';
import { Input } from '@evaluate/react/components/input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@evaluate/react/components/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@evaluate/react/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@evaluate/react/components/tooltip';
import _truncate from 'lodash/truncate';
import { FilePlus2Icon, LockIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type Control, useFieldArray } from 'react-hook-form';
import { useAnalytics } from '~/contexts/analytics';
import { useTranslate } from '~/contexts/translate';
import { EditorLoading } from './editor-loading';
import { MonacoEditor } from './monaco-editor';

export function FileSystemInput(p: {
  control: Control<Omit<ExecuteCodeOptions, 'language'>, 'files'>;
  language: Language;
}) {
  const t = useTranslate();
  const analytics = useAnalytics();

  const [editor, setEditor] = useState<'default' | 'monaco'>();
  const [lockedOpen, setLockedOpen] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(max-width: 640px)').matches) {
      setEditor('default');
    } else {
      analytics.onFeatureFlags(() => {
        if (analytics.isFeatureEnabled('monaco-editor')) setEditor('monaco');
        else setEditor('default');
      });
    }
  }, [analytics]);

  const [openedFile, setOpenedFile] = useState(0);
  const files = useFieldArray({ ...p, name: 'files' });
  const [fileNames, setFileNames] = //
    useState(files.fields.map((f) => Reflect.get(f, 'name')));

  return (
    <Tabs
      value={openedFile.toString()}
      onValueChange={(i) => setOpenedFile(Number(i))}
      className="w-full"
    >
      <div className="flex gap-2 relative">
        <TabsList className="w-full inline-flex flex-wrap h-auto">
          {files.fields.map((file, i) => (
            <TabsTrigger key={file.id} value={i.toString()}>
              <span>
                {_truncate(
                  fileNames[i]?.trim() || t.files.name.untitled(), //
                  { length: 32 },
                )}
              </span>

              {i === 0 && (
                <>
                  &nbsp;
                  <span className="text-sm font-medium text-muted-foreground">
                    ({t.files.name.main()})
                  </span>
                </>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <Button
          type="button"
          className="whitespace-nowrap"
          disabled={files.fields.length >= 10}
        >
          <FilePlus2Icon size={16} />
          <span className="sr-only">{t.files.add_file()}</span>
        </Button>

        {editor === 'monaco' && (
          <div
            className="absolute inset-0 z-40 flex cursor-not-allowed items-center justify-center bg-black/50"
            onMouseOver={() => setLockedOpen(true)}
            onMouseLeave={() => setLockedOpen(false)}
            onFocus={() => setLockedOpen(true)}
            onBlur={() => setLockedOpen(false)}
          >
            <Popover open={lockedOpen} onOpenChange={setLockedOpen}>
              <PopoverAnchor>
                <LockIcon />
              </PopoverAnchor>

              <PopoverContent className="w-auto p-1 text-sm">
                File explorer is not yet available in Monaco Editor.
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {files.fields.map((file, i) => (
        <TabsContent key={file.id} value={i.toString()}>
          <Card className="relative bg-transparent">
            <CardHeader className="gap-4">
              <FormField
                control={p.control}
                name={`files.${i}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>{t.files.name()}</FormLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder={t.files.name.description()}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      onChange={(event) => {
                        field.onChange(event);
                        setFileNames((names) => {
                          const newNames = [...names];
                          newNames[i] = event.target.value;
                          return newNames;
                        });
                      }}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={p.control}
                name={`files.${i}.content`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor={field.name}
                      onClick={() =>
                        setEditor((e) =>
                          e === 'default' ? 'monaco' : 'default',
                        )
                      }
                    >
                      {t.files.content()}
                    </FormLabel>

                    {!editor && <EditorLoading />}
                    {editor === 'default' && (
                      <HighlightedEditor
                        {...field}
                        style={{ height: '300px' }}
                        language={p.language}
                        code={field.value}
                        placeholder={t.files.content.description()}
                        onCodeChange={(c) =>
                          field.onChange({ target: { value: c } })
                        }
                      />
                    )}
                    {editor === 'monaco' && (
                      <MonacoEditor
                        name={fileNames[i]!}
                        code={field.value}
                        onChange={(c) =>
                          field.onChange({ target: { value: c } })
                        }
                      />
                    )}
                  </FormItem>
                )}
              />
            </CardHeader>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 disabled:hidden"
              onClick={() => {
                files.remove(i);
                setOpenedFile(Math.max(0, i - 1));
                setFileNames((names) => {
                  const newNames = [...names];
                  newNames.splice(i, 1);
                  return newNames;
                });
              }}
              disabled={files.fields.length <= 1}
            >
              <Trash2Icon size={16} />
              <span className="sr-only">{t.files.remove_file()}</span>
            </Button>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
