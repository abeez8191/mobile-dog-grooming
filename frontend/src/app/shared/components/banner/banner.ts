import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BannerService } from './banner.service';

@Component({
  selector: 'app-mat-banner',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'app-mat-banner',
    role: 'region',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class Banner {
  private readonly bannerService = inject(BannerService);

  /** Bind this instance to the global BannerService state. */
  readonly useService = input(false, { transform: booleanAttribute });

  /** Declarative inputs (used when useService is false). */
  readonly open = model<boolean>(true);
  readonly icon = input<string>();
  readonly primaryActionLabel = input<string>();
  readonly secondaryActionLabel = input<string>();
  readonly dismissOnAction = input(true, { transform: booleanAttribute });
  readonly elevated = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>('Notification banner');
  readonly error = input(false, { transform: booleanAttribute });
  readonly warning = input(false, { transform: booleanAttribute });
  
  readonly primaryAction = output<void>();
  readonly secondaryAction = output<void>();

  protected readonly serviceBanner = computed(() =>
    this.useService() ? this.bannerService.activeBanner() : null
  );

  protected readonly isVisible = computed(() =>
    this.useService() ? this.serviceBanner() !== null : this.open()
  );

  protected readonly resolvedIcon = computed(
    () => this.serviceBanner()?.config.icon ?? this.icon()
  );

  protected readonly resolvedPrimaryLabel = computed(
    () =>
      this.serviceBanner()?.config.primaryActionLabel ??
      this.primaryActionLabel()
  );

  protected readonly resolvedSecondaryLabel = computed(
    () =>
      this.serviceBanner()?.config.secondaryActionLabel ??
      this.secondaryActionLabel()
  );

  protected readonly resolvedElevated = computed(
    () => this.serviceBanner()?.config.elevated ?? this.elevated()
  );

  protected readonly resolvedAriaLabel = computed(
    () => this.serviceBanner()?.config.ariaLabel ?? this.ariaLabel()
  )

  protected readonly resolvedError = computed(
    () => this.serviceBanner()?.config.error ?? this.error()
  )

  protected readonly resolvedWarning = computed(
    () => this.serviceBanner()?.config.warning ?? this.warning()
  )

  protected onPrimaryAction(): void {
    const active = this.serviceBanner();
    if (active) {
      active.ref._notifyPrimaryAction();
      if (active.config.dismissOnAction ?? true) {
        active.ref.dismiss();
      }
      return;
    }

    this.primaryAction.emit();
    if (this.dismissOnAction()) {
      this.open.set(false);
    }
  }

  protected onSecondaryAction(): void {
    const active = this.serviceBanner();
    if (active) {
      active.ref._notifySecondaryAction();
      if (active.config.dismissOnAction ?? true) {
        active.ref.dismiss();
      }
      return;
    }

    this.secondaryAction.emit();
    if (this.dismissOnAction()) {
      this.open.set(false);
    }
  }
}