function join(...paths: string[]) {
  return paths.join('/').replace(/\/+/g, '/').replace(/\/$/, '');
}

export class URL extends globalThis.URL {
  constructor(input: string | { toString: () => string } | Request) {
    if (input instanceof Request) {
      const url = new URL(join(input.url));
      url.host =
        input.headers.get('x-forwarded-host') ??
        input.headers.get('host') ??
        url.host;
      super(url);
    } else {
      super(join(input.toString()));
    }
  }

  append(path: string) {
    const url = Object.isFrozen(this) ? new URL(this) : this;
    url.pathname = join(this.pathname, path);
    return url;
  }

  freeze() {
    return Object.freeze(this);
  }

  static relativePath(base: string, incoming: string) {
    if (!incoming.startsWith(base)) return null;
    return incoming.slice(base.length) as `/${string}`;
  }
}
