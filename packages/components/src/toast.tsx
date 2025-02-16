'use client';

import * as React from 'react';
import { Toaster as Sonner, toast } from 'sonner';

// So biome doesn't complain about only being used as type
void React;

type ToasterProps = React.ComponentProps<typeof Sonner> & {
  getTheme?: () => string;
};

const Toaster = ({ getTheme, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={(getTheme?.() ?? 'system') as never}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
