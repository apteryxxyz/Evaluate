import { BaseAnalytics } from '../base';

export class Analytics extends BaseAnalytics {
  protected _getPayload() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('d');

    while (String(window.location.pathname + searchParams).length > 500) {
      // @ts-expect-error - `keys` does exist
      const longestParam = [...searchParams.keys()] //
        .reduce((a, b) => (a.length > b.length ? a : b));
      searchParams.delete(longestParam);
    }

    console.log(searchParams);

    return {
      website: this.websiteId,
      hostname: window.location.hostname,
      screen: `${window.screen.width}x${window.screen.height}`,
      language: window.navigator.language,
      title:
        !document.title || document.title === 'undefined'
          ? undefined
          : document.title,
      url: `${window.location.pathname}${searchParams}`,
      referrer: document.referrer,
      ...this._payload,
    };
  }

  public track(name?: string, data?: Record<string, unknown>) {
    return this._send({ name, ...this._getPayload(), data });
  }
}
