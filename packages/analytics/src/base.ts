export abstract class BaseAnalytics {
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
      'x-umami-id': this.endpointId,
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
