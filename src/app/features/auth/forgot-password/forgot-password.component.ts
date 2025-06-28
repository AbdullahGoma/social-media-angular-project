import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  // Only UI state in signals
  isSubmitted = signal(false);
  isLoading = signal(false);

  // Regular reactive form
  reactiveForm = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    }),
  });

  constructor(private router: Router) {} // Inject Router

  async onSubmit() {
    if (this.reactiveForm.invalid) return;

    this.isLoading.set(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    this.isLoading.set(false);
    this.isSubmitted.set(true);
  }

  // Navigation method
  navigateToSignIn() {
    this.router.navigate(['/auth/sign-in']);
  }

  // Helper methods for template
  get email() {
    return this.reactiveForm.get('email');
  }

  get emailIsInvalid() {
    return this.email?.invalid && (this.email?.touched || this.email?.dirty);
  }
}
