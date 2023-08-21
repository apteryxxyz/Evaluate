import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** A utility function to merge class names with Tailwind's `twMerge` and `clsx`. */
export function cn(...className: ClassValue[]) {
  return twMerge(clsx(className));
}
