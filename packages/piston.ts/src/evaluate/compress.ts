// pako needed for support in browser
import pako from 'pako';

export type Compressed<T> = string & { as: T };

/**
 * Compresses data to a string.
 * @param data Data to compress.
 * @returns Branded compressed string.
 */
export function compress<T>(data: T): Compressed<T> {
  const u8 = pako.deflate(JSON.stringify(data));
  const b64 = btoa(String.fromCharCode(...u8));
  return b64.replaceAll('=', '') as Compressed<T>;
}

/**
 * Decompresses a string to its original data.
 * @param compressed Compressed string, preferably branded.
 * @returns Original data.
 */
export function decompress<T>(compressed: Compressed<T> | string): T {
  const u8 = Uint8Array.from(atob(compressed), (c) => c.charCodeAt(0));
  return JSON.parse(pako.inflate(u8, { to: 'string' })) as T;
}
