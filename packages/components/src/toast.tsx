'use client';

import { Toaster as Sonner, toast } from 'sonner';

function Toaster({
  getTheme,
  ...props
}: React.ComponentProps<typeof Sonner> & {
  getTheme?: () => string;
}) {
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
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium',
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
