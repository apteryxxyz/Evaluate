'use client';

import _omit from 'lodash/omit';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import PossibleEditor from 'react-simple-code-editor';
import { cn } from '~/utilities/class-name';
import { TextareaProps } from '../textarea';

// Idk why we need to use default crap, but here it is
// biome-ignore lint/suspicious/noExplicitAny: Needed
const Editor: any =
  'default' in PossibleEditor ? PossibleEditor.default : PossibleEditor;

export const BaseEditor = forwardRef((
  p: React.HTMLAttributes<HTMLDivElement> &
    Omit<TextareaProps, 'value' | 'onChange' | 'style'> & {
      code: string;
      onCodeChange: (code: string) => void;
      highlighter?: (code: string) => string;
      dynamicStyle?:
         ((isFocused: boolean) => React.CSSProperties);
    },
  ref: React.Ref<HTMLTextAreaElement>,
) => {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>();

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    focus: () => editorRef.current?.focus(),
    blur: () => editorRef.current?.blur(),
  }));

  return (
    <Editor
      ref={editorRef}
      {..._omit(p, ['language', 'highlighter', 'dynamicStyle', 'code', 'setCode'])}
      value={p.code}
      onValueChange={p.onCodeChange}
      highlight={p.highlighter ?? ((code) => code)}
      //
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      //
      style={{
        ...(p.style??{}),
        ...p.dynamicStyle?.(isFocused),
      }}
      className={cn(
        '!overflow-visible min-h-[120px] rounded-md border border-input text-sm bg-transparent shadow duration-300',
        p.code && 'font-mono',
        isFocused && 'border-ring',
        p.code.length > 0 && p.className,
      )}
      preClassName="!px-3 !py-2"
      textareaClassName="!px-3 !py-2 !outline-none placeholder:text-muted-foreground"
    />
  );
});
