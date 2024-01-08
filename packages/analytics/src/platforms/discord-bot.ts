import { BaseAnalytics } from '../base';

export class Analytics extends BaseAnalytics {
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
