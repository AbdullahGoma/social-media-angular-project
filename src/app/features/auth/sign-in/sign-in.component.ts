import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { debounceTime } from 'rxjs';

// Load initial values from localStorage
let initialFormData: any = {
  email: '',
  password: '',
  rememberMe: false,
};

const savedForm = window.localStorage.getItem('saved-login-form');
if (savedForm) {
  initialFormData = { ...initialFormData, ...JSON.parse(savedForm) };
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  reactiveForm = new FormGroup({
    email: new FormControl(initialFormData.email, {
      validators: [Validators.required, this.emailFormatValidator],
    }),
    password: new FormControl(initialFormData.password, {
      validators: [Validators.required, Validators.minLength(8)],
    }),
    rememberMe: new FormControl(initialFormData.rememberMe),
  });

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const subscription = this.reactiveForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          // Only save if rememberMe is checked
          if (value.rememberMe) {
            window.localStorage.setItem(
              'saved-login-form',
              JSON.stringify(value)
            );
          } else {
            // Clear saved data if rememberMe is unchecked
            localStorage.removeItem('saved-login-form');
          }
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  // Form control getters
  get email() {
    return this.reactiveForm.get('email');
  }
  get password() {
    return this.reactiveForm.get('password');
  }
  get rememberMe() {
    return this.reactiveForm.get('rememberMe');
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

  // Custom validators
  private emailFormatValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value || '';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : { invalidEmail: true };
  }

  onSubmit() {
    if (this.reactiveForm.invalid) return;

    console.log('Form submitted:', this.reactiveForm.value);

    // Clear saved data if rememberMe is unchecked
    if (!this.reactiveForm.value.rememberMe) {
      localStorage.removeItem('saved-login-form');
    }

    // Handle login logic here
    // this.authService.login(this.reactiveForm.value);
  }
}
