import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-two-factor-auth-modal',
  standalone: true,
  imports: [],
  templateUrl: './two-factor-auth-modal.component.html',
  styleUrl: './two-factor-auth-modal.component.css',
})
export class TwoFactorAuthModalComponent {
  @Output() close = new EventEmitter<void>();
  twoFactorEnabled = signal(false);
  verificationCode = signal('');

  onCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.verificationCode.set(input.value);
  }

  toggleTwoFactor() {
    if (this.twoFactorEnabled()) {
      // Disable logic
      this.twoFactorEnabled.set(false);
    } else {
      // Enable logic
      this.twoFactorEnabled.set(true);
    }
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}
