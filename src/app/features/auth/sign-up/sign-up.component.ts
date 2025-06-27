import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  FormArray,
  ValidatorFn,
} from '@angular/forms';
import { debounceTime } from 'rxjs';

// Load initial values from localStorage
let initialFormData: any = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  terms: false,
};

const savedForm = window.localStorage.getItem('saved-signup-form');
if (savedForm) {
  initialFormData = { ...initialFormData, ...JSON.parse(savedForm) };
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  reactiveForm = new FormGroup({
    email: new FormControl(initialFormData.email, {
      validators: [Validators.required, this.emailFormatValidator],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl(initialFormData.password, {
          validators: [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator,
          ],
        }),
        confirmPassword: new FormControl(initialFormData.confirmPassword, {
          validators: [Validators.required],
        }),
      },
      {
        validators: [
          this.passwordMatchValidatorGeneric('password', 'confirmPassword'),
        ],
      }
    ),
    name: new FormGroup({
      firstName: new FormControl(initialFormData.firstName, {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.nameValidator,
          this.strictNameValidator,
        ],
      }),
      lastName: new FormControl(initialFormData.lastName, {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.nameValidator,
          this.strictNameValidator,
        ],
      }),
    }),
    terms: new FormControl(initialFormData.terms, {
      validators: [Validators.requiredTrue],
    }),
  });

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const subscription = this.reactiveForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          // Don't save password and confirmPassword for security reasons
          const { passwords, ...valuesToSave } = value;
          window.localStorage.setItem(
            'saved-signup-form',
            JSON.stringify(valuesToSave)
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  // Form control getters
  get email() {
    return this.reactiveForm.get('email');
  }
  get passwords() {
    return this.reactiveForm.get('passwords');
  }
  get password() {
    return this.reactiveForm.get('passwords.password');
  }
  get confirmPassword() {
    return this.reactiveForm.get('passwords.confirmPassword');
  }
  get nameGroup() {
    return this.reactiveForm.get('name') as FormGroup;
  }
  get firstName() {
    return this.nameGroup.get('firstName');
  }
  get lastName() {
    return this.nameGroup.get('lastName');
  }
  get terms() {
    return this.reactiveForm.get('terms');
  }

  // Validation state getters
  get emailIsInvalid() {
    return this.email?.invalid && (this.email?.touched || this.email?.dirty);
  }
  get passwordIsInvalid() {
    return (
      this.password?.invalid && (this.password?.touched || this.password?.dirty)
    );
  }
  get confirmPasswordIsInvalid() {
    return (
      this.confirmPassword?.invalid &&
      (this.confirmPassword?.touched || this.confirmPassword?.dirty)
    );
  }
  get firstNameIsInvalid() {
    return (
      this.firstName?.invalid &&
      (this.firstName?.touched || this.firstName?.dirty)
    );
  }
  get lastNameIsInvalid() {
    return (
      this.lastName?.invalid && (this.lastName?.touched || this.lastName?.dirty)
    );
  }
  get termsIsInvalid() {
    return this.terms?.invalid && this.terms?.touched;
  }

  // Custom validators
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

  private emailFormatValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value || '';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : { invalidEmail: true };
  }

  private passwordMatchValidatorGeneric(
    passwordKey: string,
    confirmPasswordKey: string
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get(passwordKey)?.value;
      const confirmPassword = group.get(confirmPasswordKey)?.value;

      if (!password || !confirmPassword) {
        return null;
      }

      return password !== confirmPassword ? { passwordMismatch: true } : null;
    };
  }

  private nameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const isValid = /^[a-zA-Zà-üÀ-Ü\s'-]{2,50}$/.test(value);
    return !isValid ? { invalidName: true } : null;
  }

  private strictNameValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value || '';

    if (/[0-9!@#$%^&*()_+=<>?/\\[\]{}|]/.test(value)) {
      return { containsInvalidChars: true };
    }

    if (!/^[a-zA-Zà-üÀ-Ü' -]+$/.test(value)) {
      return { invalidFormat: true };
    }

    return null;
  }

  onSubmit() {
    if (this.reactiveForm.invalid) return;

    console.log('Form submitted:', this.reactiveForm.value);
    localStorage.removeItem('saved-signup-form');
    this.reactiveForm.reset();
  }

  onReset() {
    this.reactiveForm.reset({
      passwords: {
        password: '',
        confirmPassword: '',
      },
      name: {
        firstName: '',
        lastName: '',
      },
      terms: false,
    });
  }
}
