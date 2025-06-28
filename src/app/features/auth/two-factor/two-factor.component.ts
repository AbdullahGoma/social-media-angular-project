import { CommonModule } from '@angular/common';
import {
  Component,
  signal,
  effect,
  viewChild,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css'],
})
export class TwoFactorComponent {
  // UI state signals
  isSubmitted = signal(false);
  isLoading = signal(false);
  isResendDisabled = signal(false);
  resendCountdown = signal(30);

  private router = inject(Router);
  

  // Form group for the OTP
  otpForm = new FormGroup({
    digit1: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d$/),
    ]),
    digit2: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d$/),
    ]),
    digit3: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d$/),
    ]),
    digit4: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d$/),
    ]),
    digit5: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d$/),
    ]),
    digit6: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d$/),
    ]),
  });

  // Template references
  digit1 = viewChild<ElementRef>('digit1');
  digit2 = viewChild<ElementRef>('digit2');
  digit3 = viewChild<ElementRef>('digit3');
  digit4 = viewChild<ElementRef>('digit4');
  digit5 = viewChild<ElementRef>('digit5');
  digit6 = viewChild<ElementRef>('digit6');

  // Array of input references for easier access
  private inputs: ElementRef[] = [];

  constructor() {
    // Setup resend countdown timer
    effect(() => {
      if (this.isResendDisabled()) {
        const timer = setInterval(() => {
          this.resendCountdown.update((val) => {
            if (val <= 1) {
              clearInterval(timer);
              this.isResendDisabled.set(false);
              return 30;
            }
            return val - 1;
          });
        }, 1000);
      }
    });

    // Initialize inputs after view is ready
    afterNextRender(() => {
      this.inputs = [
        this.digit1(),
        this.digit2(),
        this.digit3(),
        this.digit4(),
        this.digit5(),
        this.digit6(),
      ].filter(Boolean) as ElementRef[];
    });
  }

  // Handle input events for OTP fields
  onInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Move to next field if a digit was entered
    if (value.match(/^\d$/) && index < 5 && this.inputs[index + 1]) {
      this.inputs[index + 1].nativeElement.focus();
    }

    // Update form control value
    const controlName = `digit${
      index + 1
    }` as keyof typeof this.otpForm.controls;
    this.otpForm.get(controlName)?.setValue(value);
  }

  // Handle backspace key
  onKeyDown(index: number, event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    if (
      event.key === 'Backspace' &&
      !input.value &&
      index > 0 &&
      this.inputs[index - 1]
    ) {
      this.inputs[index - 1].nativeElement.focus();
    }
  }

  // Get the full OTP code
  get otpCode(): string {
    return Object.values(this.otpForm.value).join('');
  }

  // Handle form submission
  async onSubmit() {
    if (this.otpForm.invalid) return;

    this.isLoading.set(true);

    // Simulate API verification
    await new Promise((resolve) => setTimeout(resolve, 1500));

    this.router.navigateByUrl('/app/timeline', { replaceUrl: true });

    this.isLoading.set(false);
    this.isSubmitted.set(true);
  }

  // Handle resend code
  async onResend() {
    this.isResendDisabled.set(true);
    this.resendCountdown.set(30);
    this.otpForm.reset();

    // Simulate API call to resend code
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('New verification code sent');
  }
}
