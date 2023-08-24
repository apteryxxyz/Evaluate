import truncate from 'lodash/truncate';
import { FilePlus2Icon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { useTranslate } from '@/contexts/translate';
import { Button } from './ui/button';
import { Card, CardHeader } from './ui/card';
import { FormField, FormItem, FormLabel } from './ui/form';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';

interface FileSystemInputProps {
  control: Control<{ files: { name?: string; content: string }[] }>;
}

export function FileSystemInput(p: FileSystemInputProps) {
  const t = useTranslate();
  const [activeFile, setActiveFile] = useState<string | number>(0);
  const [names, setNames] = useState<string[]>([]);
  const files = useFieldArray({ ...p, name: 'files' });

  return (
    <Tabs
      value={activeFile.toString()}
      onValueChange={(index) => setActiveFile(index)}
    >
      <div className="flex gap-2">
        <TabsList className="w-full">
          {files.fields.map((file, index) => (
            <TabsTrigger key={file.id} value={index.toString()}>
              <span>
                {truncate(
                  names[index]?.trim() || t.files.untitled(), //
                  { length: 32 },
                )}
              </span>

              {index === 0 && (
                <>
                  &nbsp;
                  <span className="text-sm font-medium text-muted-foreground">
                    &#x28;{t.files.main()}&#x29;
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
            setActiveFile(files.fields.length);
          }}
          disabled={files.fields.length >= 10}
        >
          <FilePlus2Icon />
        </Button>
      </div>

      {files.fields.map((file, index) => (
        <TabsContent key={file.id} value={index.toString()}>
          <Card className="relative">
            <CardHeader className="gap-4">
              <FormField
                control={p.control}
                name={`files.${index}.name`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor={field.name}>{t.files.name()}</FormLabel>
                    <Input
                      {...field}
                      id={field.name}
                      className="w-full"
                      placeholder={t.files.name.description()}
                      onChange={(event) => {
                        field.onChange(event);
                        setNames((names) => {
                          const newNames = [...names];
                          newNames[index] = event.target.value;
                          return newNames;
                        });
                      }}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={p.control}
                name={`files.${index}.content`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor={field.name}>
                      {t.files.content()}
                    </FormLabel>
                    <Textarea
                      {...field}
                      id={field.name}
                      className="w-full"
                      placeholder={t.files.content.description()}
                    />
                  </FormItem>
                )}
              />
            </CardHeader>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => {
                files.remove(index);
                setActiveFile(index - 1);
              }}
              disabled={files.fields.length <= 1}
            >
              <Trash2Icon />
            </Button>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
