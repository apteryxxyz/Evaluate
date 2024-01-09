export abstract class Analytics {
  public constructor(
    public readonly websiteId: string,
    public readonly endpointId: string,
  ) {}

  protected _payload: Record<string, unknown> = {};
  protected abstract _getPayload(): Record<string, unknown>;
  public append(key: string, value: unknown) {
    this._payload[key] = value;
  }

  private _cache?: string;
  protected async _send(payload: Record<string, unknown>, type = 'event') {
    const headers = new Headers({
      'content-type': 'application/json',
      'x-umami-id': this.websiteId,
    });

    if (typeof window === 'undefined')
      headers.append('user-agent', 'Evaluate/Analytics');
    if (this._cache) headers.append('x-umami-cache', this._cache);

    return fetch(this.endpointId, {
      method: 'POST',
      body: JSON.stringify({ type, payload }),
      headers,
    })
      .then((response) => response.text())
      .then((text) => (this._cache = text))
      .catch(() => {}); // no-op, gulp error
  }
}

export class BrowserExtensionAnalytics extends Analytics {
  protected _getPayload() {
    if (window.location.pathname === '/popup.html') {
      return {
        website: this.websiteId,
        language: window.navigator.language,
        ...this._payload,
      };
    } else {
      return {
        website: this.websiteId,
        hostname: window.location.hostname,
        screen: `${window.screen.width}x${window.screen.height}`,
        language: window.navigator.language,
        ...this._payload,
      };
    }
  }

  public track(name: string, data?: Record<string, unknown>) {
    return this._send({ name, ...this._getPayload(), data });
  }
}

export class DiscordBotAnalytics extends Analytics {
  protected _getPayload() {
    return {
      website: this.websiteId,
      ...this._payload,
    };
  }

  public track(name: string, data?: Record<string, unknown>) {
    return this._send({ name, ...this._getPayload(), data });
  }
}

export class WebsiteAnalytics extends Analytics {
  protected _getPayload() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('d');

    while (String(window.location.pathname + searchParams).length > 500) {
      // @ts-expect-error - `keys` does exist
      const longestParam = [...searchParams.keys()] //
        .reduce((a, b) => (a.length > b.length ? a : b));
      searchParams.delete(longestParam);
    }

    return {
      website: this.websiteId,
      hostname: window.location.hostname,
      screen: `${window.screen.width}x${window.screen.height}`,
      language: window.navigator.language,
      title:
        !document.title || document.title === 'undefined'
          ? undefined
          : document.title,
      url: `${window.location.pathname}?${searchParams}`,
      referrer: document.referrer,
      ...this._payload,
    };
  }

  public track(name?: string, data?: Record<string, unknown>) {
    return this._send({ name, ...this._getPayload(), data });
  }
}
