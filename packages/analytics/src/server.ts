export class Analytics<_ extends 'Server' = 'Server'> {
  public constructor(
    public readonly websiteId: string,
    public readonly endpointUrl?: string,
    public readonly fakeUrl?: string,
  ) {}

  private async _send(payload: Record<string, unknown>, type = 'event') {
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('x-umami-id', this.websiteId);
    headers.append('user-agent', 'Evaluate/Analytics');

    const endpoint = new URL('/api/send', this.endpointUrl);
    return fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ type, payload }),
      headers,
    })
      .then((response) => response.text())
      .catch(() => {}); // no-op, gulp error
  }

  public track(name?: string, data?: Record<string, unknown>) {
    return this._send({ ...this._getPayload(), name, data });
  }

  private _getPayload() {
    return { website: this.websiteId, url: this.fakeUrl };
  }
}
