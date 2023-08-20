import { inspect } from 'node:util';

/**
 * Use node's `util.inspect` to check if a promise is pending.
 * @param promise The promise to check
 */
export function isPending(promise: Promise<unknown>) {
  return inspect(promise, { depth: 0 }).includes('pending');
}

/**
 * Check if a promise is fulfilled.
 * @param promise The promise to check
 */
export function isFulfilled(promise: Promise<unknown>) {
  return !isPending(promise);
}
