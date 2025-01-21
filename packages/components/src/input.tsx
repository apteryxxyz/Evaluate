import { type VariantProps, cn, cva } from '@evaluate/helpers/class';
import * as React from 'react';

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors disabled:cursor-not-allowed file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1',
  {
    variants: {
      variant: {
        default: 'focus-visible:ring-ring',
        destructive: 'focus-visible:ring-destructive',
      },
      size: {
        default: 'h-9 text-sm file:text-sm',
        sm: 'h-8 text-xs file:text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
