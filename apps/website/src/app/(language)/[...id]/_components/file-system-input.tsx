'use client';

import type { ExecuteCodeOptions, Language } from '@evaluate/execute';
import { Button } from '@evaluate/ui/button';
import { Card, CardHeader } from '@evaluate/ui/card';
import { FormField, FormItem, FormLabel } from '@evaluate/ui/form';
import { Input } from '@evaluate/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@evaluate/ui/tabs';
import _truncate from 'lodash/truncate';
import { FilePlus2Icon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { type Control, useFieldArray } from 'react-hook-form';
import { useTranslate } from '~/contexts/translate';
import { CodeEditor } from './code-editor';

export function FileSystemInput(p: {
  control: Control<Omit<ExecuteCodeOptions, 'language'>, 'files'>;
  language: Language;
}) {
  const t = useTranslate();
  const [openedFile, setOpenedFile] = useState(0);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const files = useFieldArray({ ...p, name: 'files' });

  return (
    <Tabs
      value={openedFile.toString()}
      onValueChange={(i) => setOpenedFile(Number(i))}
      className="w-full"
    >
      <div className="flex gap-2">
        <TabsList className="w-full inline-flex flex-wrap h-auto">
          {files.fields.map((file, i) => (
            <TabsTrigger key={file.id} value={i.toString()}>
              <span>
                {_truncate(
                  fileNames[i]?.trim() || t.files.untitled(), //
                  { length: 32 },
                )}
              </span>

              {i === 0 && (
                <>
                  &nbsp;
                  <span className="text-sm font-medium text-muted-foreground">
                    ({t.files.main()})
                  </span>
                </>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <Button
          type="button"
          className="whitespace-nowrap"
          onClick={() => {
            files.append({ content: '' });
            setOpenedFile(files.fields.length);
          }}
          disabled={files.fields.length >= 10}
        >
          <FilePlus2Icon />
          <span className="sr-only">{t.screen_reader.add_file()}</span>
        </Button>
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
                    <FormLabel htmlFor={field.name}>
                      {t.files.content()}
                    </FormLabel>
                    <CodeEditor
                      {...field}
                      language={p.language}
                      code={field.value}
                      placeholder={t.files.content.description()}
                      setCode={(c) => field.onChange({ target: { value: c } })}
                    />
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
              <Trash2Icon />
              <span className="sr-only">{t.screen_reader.remove_file()}</span>
            </Button>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
