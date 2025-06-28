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
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css'],
})
export class ConfirmEmailComponent {
  // UI state signals
  isSubmitted = signal(false);
  isLoading = signal(false);
  isResent = signal(false);

  constructor(private router: Router) {}

  // Reactive form
  confirmForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
  });

  // Form control getter
  get email() {
    return this.confirmForm.get('email');
  }

  // Validation state getter
  get emailIsInvalid() {
    return this.email?.invalid && (this.email?.touched || this.email?.dirty);
  }

  async onSubmit() {
    if (this.confirmForm.invalid) return;

    this.isLoading.set(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    this.isLoading.set(false);
    this.isSubmitted.set(true);
    this.isResent.set(true);
  }

  navigateToSignIn() {
    this.router.navigate(['/auth/sign-in'], { replaceUrl: true });
  }
}
