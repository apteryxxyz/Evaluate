export class URL2 implements Readonly<URL> {
  #url: URL;

  constructor(input: string | { toString(): string }) {
    this.#url = new URL(String(input));
  }

  append(path: string) {
    const url = new URL(this.#url);
    url.pathname = URL2.joinPaths(this.#url.pathname, path);
    return new URL2(url);
  }

  get hash() {
    return this.#url.hash;
  }
  get host() {
    return this.#url.host;
  }
  get hostname() {
    return this.#url.hostname;
  }
  get href() {
    return this.#url.href;
  }
  get origin() {
    return this.#url.origin;
  }
  get password() {
    return this.#url.password;
  }
  get pathname() {
    return this.#url.pathname;
  }
  get port() {
    return this.#url.port;
  }
  get protocol() {
    return this.#url.protocol;
  }
  get search() {
    return this.#url.search;
  }
  get searchParams() {
    return this.#url.searchParams;
  }
  get username() {
    return this.#url.username;
  }
  toJSON() {
    return this.#url.toJSON();
  }
  toString() {
    return URL2.joinPaths(this.#url.toString());
  }

  static relativePath(base: string, incoming: string) {
    if (!incoming.startsWith(base)) return null;
    return incoming.slice(base.length) as `/${string}`;
  }

  static joinPaths(...paths: string[]) {
    return paths
      .join('/')
      .replace(/(?<!:)\/+/g, '/')
      .replace(/\/$/, '');
  }

  static fromRequest(request: Request) {
    const url = new URL(URL2.joinPaths(request.url));
    url.host =
      request.headers.get('x-forwarded-host') ??
      request.headers.get('host') ??
      url.host;
    return new URL2(url);
  }
}
