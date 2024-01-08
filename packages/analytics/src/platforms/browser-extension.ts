import { BaseAnalytics } from '../base';

export class Analytics extends BaseAnalytics {
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
