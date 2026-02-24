// biome-ignore-all format: i do
// biome-ignore-all lint: what i want

export interface Callable<Fn extends (...args: any[]) => any> {
  (...args: Parameters<Fn>): ReturnType<Fn>;
}

export class Callable<Fn extends (...args: any[]) => any> {
  constructor(fn: Fn) {
    return Object.setPrototypeOf(fn, new.target.prototype);
  }
}
