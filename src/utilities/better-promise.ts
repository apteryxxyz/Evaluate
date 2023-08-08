import { inspect } from 'node:util';

export function isPromisePending<T>(promise: Promise<T>) {
  const inspected = inspect(promise, { depth: 0 });
  return inspected.includes('<pending>');
}

export function isPromiseFulfilled<T>(promise: Promise<T>) {
  return isPromisePending(promise) === false;
}
