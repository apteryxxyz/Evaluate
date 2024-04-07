import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to merge class names.
 * @param className list of class names
 * @returns a string of class names
 */
export function cn(...className: ClassValue[]) {
  return twMerge(clsx(className));
}

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
