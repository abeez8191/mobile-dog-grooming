import { Observable, Subject } from 'rxjs';

export interface BannerConfig {
  message: string;
  icon?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  elevated?: boolean;
  /** Whether clicking an action button closes the banner automatically. Defaults to true. */
  dismissOnAction?: boolean;
  ariaLabel?: string;
  error?: boolean;
  warning?: boolean;
  timeout?: number;
}

export class BannerRef {
  private readonly primaryActionSubject = new Subject<void>();
  private readonly secondaryActionSubject = new Subject<void>();
  private readonly dismissedSubject = new Subject<void>();

  constructor(private readonly closeFn: () => void) {}

  /** Emits when the user clicks the primary action button. */
  onPrimaryAction(): Observable<void> {
    return this.primaryActionSubject.asObservable();
  }

  /** Emits when the user clicks the secondary action button. */
  onSecondaryAction(): Observable<void> {
    return this.secondaryActionSubject.asObservable();
  }

  /** Emits once when the banner is closed. */
  afterDismissed(): Observable<void> {
    return this.dismissedSubject.asObservable();
  }

  /** Programmatically closes the banner. */
  dismiss(): void {
    this.closeFn();
  }

  /** @internal */
  _notifyPrimaryAction(): void {
    this.primaryActionSubject.next();
  }

  /** @internal */
  _notifySecondaryAction(): void {
    this.secondaryActionSubject.next();
  }

  /** @internal */
  _notifyDismissed(): void {
    this.dismissedSubject.next();
    this.primaryActionSubject.complete();
    this.secondaryActionSubject.complete();
    this.dismissedSubject.complete();
  }
}