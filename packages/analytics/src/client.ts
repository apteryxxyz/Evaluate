export class Analytics<_ extends 'Client' = 'Client'> {
  public constructor(
    public readonly websiteId: string,
    public readonly websiteUrl: string,
  ) {}

  private _cache?: string;

  private async _send(payload: Record<string, unknown>, type = 'event') {
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('x-umami-id', this.websiteId);
    if (this._cache) headers.append('x-umami-cache', this._cache);

    const endpoint = new URL('/api/send', this.websiteUrl);
    return fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ type, payload }),
      headers,
    })
      .then((response) => response.text())
      .then((text) => (this._cache = text))
      .catch(() => {}); // no-op, gulp error
  }

  public track(name?: string, data?: Record<string, unknown>) {
    return this._send({ ...this._getPayload(), name, data });
  }

  public identify(data?: Record<string, unknown>) {
    return this._send({ ...this._getPayload(), data }, 'identify');
  }

  private _getPayload() {
    return {
      website: this.websiteId,
      hostname: window.location.hostname,
      screen: `${window.screen.width}x${window.screen.height}`,
      language: window.navigator.language,
      title: document.title,
      url: `${window.location.pathname}${window.location.search}`,
      referrer: document.referrer,
    } as const;
  }
}
