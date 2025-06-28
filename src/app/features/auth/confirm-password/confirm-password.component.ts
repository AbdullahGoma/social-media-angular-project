import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirm-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.css'],
})
export class ConfirmPasswordComponent {
  // UI state signals
  isSubmitted = signal(false);
  isLoading = signal(false);
  isSuccess = signal(false);

  constructor(private router: Router) {}

  // Reactive form
  passwordForm = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator,
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator }
  );

  // Custom validator for password strength
  private passwordStrengthValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const errors: ValidationErrors = {};
    if (!hasUpperCase) errors['missingUpperCase'] = true;
    if (!hasLowerCase) errors['missingLowerCase'] = true;
    if (!hasNumber) errors['missingNumber'] = true;
    if (!hasSpecialChar) errors['missingSpecialChar'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  // Custom validator for password matching
  private passwordMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  // Form control getters for template
  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  // Validation state getters
  get newPasswordIsInvalid() {
    return (
      this.newPassword?.invalid &&
      (this.newPassword?.touched || this.newPassword?.dirty)
    );
  }

  get confirmPasswordIsInvalid() {
    return (
      this.confirmPassword?.invalid &&
      (this.confirmPassword?.touched || this.confirmPassword?.dirty)
    );
  }

  get passwordsMismatch() {
    return (
      this.passwordForm.errors?.['passwordMismatch'] &&
      this.confirmPassword?.touched
    );
  }

  async onSubmit() {
    if (this.passwordForm.invalid) return;

    this.isLoading.set(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    this.isLoading.set(false);
    this.isSubmitted.set(true);
    this.isSuccess.set(true);
    this.passwordForm.reset();
  }

  navigateToSignIn() {
    this.router.navigate(['/auth/sign-in'], { replaceUrl: true });
  }
}
