import { Injectable, signal } from '@angular/core';
import { BannerConfig, BannerRef } from './banner.model';

export interface ActiveBanner {
  config: BannerConfig;
  ref: BannerRef;
}

@Injectable({ providedIn: 'root' })
export class BannerService {
  private readonly activeBannerSignal = signal<ActiveBanner | null>(null);

  /** Read-only signal consumed by the banner outlet/component. */
  readonly activeBanner = this.activeBannerSignal.asReadonly();

  /**
   * Opens a banner with the given message and optional configuration.
   * Replaces any currently open banner.
   */
  open(message: string, config?: Omit<BannerConfig, 'message'>): BannerRef;
  open(config: BannerConfig): BannerRef;
  open(
    messageOrConfig: string | BannerConfig,
    extraConfig?: Omit<BannerConfig, 'message'>
  ): BannerRef {
    // Clean up existing banner if one is active
    this.dismiss();

    const config: BannerConfig =
      typeof messageOrConfig === 'string'
        ? { message: messageOrConfig, ...extraConfig }
        : messageOrConfig;

    const ref = new BannerRef(() => this.dismiss());
    this.activeBannerSignal.set({ config, ref });
    return ref;
  }

  /** Dismisses the currently active banner, if any. */
  dismiss(): void {
    const current = this.activeBannerSignal();
    if (current) {
      this.activeBannerSignal.set(null);
      current.ref._notifyDismissed();
    }
  }
}