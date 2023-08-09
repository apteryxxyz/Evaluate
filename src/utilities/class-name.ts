import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...className: ClassValue[]) {
  return twMerge(clsx(className));
}
