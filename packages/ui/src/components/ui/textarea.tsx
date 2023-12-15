'use client';

import * as React from 'react';
import { cn } from '~/utilities/class-name';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
      // Automatically resize textarea to fit content
      void props.value;
      if (!textareaRef.current) return;
      const element = textareaRef.current;
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    }, [props.value, textareaRef.current]);

    const mergedRef = React.useCallback(
      (textarea: HTMLTextAreaElement | null) => {
        Reflect.set(textareaRef, 'current', textarea);
        if (typeof ref === 'function') ref(textarea);
        else if (ref) ref.current = textarea;
      },
      [ref, textareaRef],
    );

    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden resize-none',
          className,
        )}
        ref={mergedRef}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
