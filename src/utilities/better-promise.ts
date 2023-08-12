import { inspect } from 'node:util';

export function isPending(promise: Promise<unknown>) {
  return inspect(promise, { depth: 0 }).includes('pending');
}

export function isFulfilled(promise: Promise<unknown>) {
  return !isPending(promise);
}
