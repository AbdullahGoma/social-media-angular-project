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

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  // UI state signals
  isSubmitted = signal(false);
  isLoading = signal(false);

  // Reactive form
  passwordForm = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator,
      ]),
      confirmNewPassword: new FormControl('', [Validators.required]),
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
    const confirmPassword = group.get('confirmNewPassword')?.value;
    return newPassword && confirmPassword && newPassword !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  // Form control getters for template
  get currentPassword() {
    return this.passwordForm.get('currentPassword');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get confirmNewPassword() {
    return this.passwordForm.get('confirmNewPassword');
  }

  // Validation state getters
  get currentPasswordIsInvalid() {
    return (
      this.currentPassword?.invalid &&
      (this.currentPassword?.touched || this.currentPassword?.dirty)
    );
  }

  get newPasswordIsInvalid() {
    return (
      this.newPassword?.invalid &&
      (this.newPassword?.touched || this.newPassword?.dirty)
    );
  }

  get confirmNewPasswordIsInvalid() {
    return (
      this.confirmNewPassword?.invalid &&
      (this.confirmNewPassword?.touched || this.confirmNewPassword?.dirty)
    );
  }

  get passwordsMismatch() {
    return (
      this.passwordForm.errors?.['passwordMismatch'] &&
      this.confirmNewPassword?.touched
    );
  }

  async onSubmit() {
    if (this.passwordForm.invalid) return;

    this.isLoading.set(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    this.isLoading.set(false);
    this.isSubmitted.set(true);
    this.passwordForm.reset();
  }
}
