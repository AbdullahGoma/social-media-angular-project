import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ModalService } from '../../../../../core/services/modal.service';
import { UserService } from '../../../../../core/services/user.service';
import { ModalType } from '../../../../models/modal-type';
import { AboutService } from '../../../../../core/services/about.service';

@Component({
  selector: 'app-about-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.css'],
})
export class AboutUserModalComponent {
  private modalService = inject(ModalService);
  private userService = inject(UserService);
  private aboutService = inject(AboutService);
  private destroyRef = inject(DestroyRef);

  isModalOpen = this.modalService.isModalOpen(ModalType.AboutUser);
  currentUserAbout = this.aboutService.about;

  constructor() {
    effect(() => {
      if (this.isModalOpen()) {
        this.initForm();
      }
    });
  }

  // Form definition
  aboutForm = new FormGroup({
    playerName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      this.nameValidator(),
    ]),
    job: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ]),
    location: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
    status: new FormControl<
      'single' | 'married' | 'divorced' | 'widowed' | 'other'
    >('single', [Validators.required]),
    education: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      this.phoneNumberValidator(),
    ]),
  });

  // Initialize form with current user data
  private initForm() {
    const aboutUser = this.currentUserAbout();
    if (aboutUser) {
      this.aboutForm.patchValue({
        playerName: aboutUser.playerName || '',
        job: aboutUser.job || '',
        location: aboutUser.location || '',
        status: aboutUser.status || 'single',
        education: aboutUser.education || '',
        phoneNumber: aboutUser.phoneNumber || '',
      });
    }
  }

  // Convenience getters for form controls
  get playerName() {
    return this.aboutForm.get('playerName');
  }
  get job() {
    return this.aboutForm.get('job');
  }
  get location() {
    return this.aboutForm.get('location');
  }
  get status() {
    return this.aboutForm.get('status');
  }
  get education() {
    return this.aboutForm.get('education');
  }
  get phoneNumber() {
    return this.aboutForm.get('phoneNumber');
  }

  // Validation state getters
  get playerNameIsInvalid() {
    return (
      this.playerName?.invalid &&
      (this.playerName?.dirty || this.playerName?.touched)
    );
  }
  get jobIsInvalid() {
    return this.job?.invalid && (this.job?.dirty || this.job?.touched);
  }
  get locationIsInvalid() {
    return (
      this.location?.invalid && (this.location?.dirty || this.location?.touched)
    );
  }
  get statusIsInvalid() {
    return this.status?.invalid && (this.status?.dirty || this.status?.touched);
  }
  get educationIsInvalid() {
    return (
      this.education?.invalid &&
      (this.education?.dirty || this.education?.touched)
    );
  }
  get phoneNumberIsInvalid() {
    return (
      this.phoneNumber?.invalid &&
      (this.phoneNumber?.dirty || this.phoneNumber?.touched)
    );
  }

  // Custom validators
  private nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      if (!value) return null;

      const isValid = /^[a-zA-Zà-üÀ-Ü\s'-]+$/.test(value);
      return !isValid ? { invalidName: true } : null;
    };
  }

  private phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      if (!value) return null;

      const isValid = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(value);
      return !isValid ? { invalidPhoneNumber: true } : null;
    };
  }

  getStatusOptions(): { value: string; display: string }[] {
    return [
      { value: 'single', display: 'Single' },
      { value: 'married', display: 'Married' },
      { value: 'divorced', display: 'Divorced' },
      { value: 'widowed', display: 'Widowed' },
      { value: 'other', display: 'Other' },
    ];
  }

  onSubmit() {
    if (this.aboutForm.invalid) {
      this.aboutForm.markAllAsTouched();
      return;
    }

    const formValue = this.aboutForm.value;
    this.userService.updateAbout({
      job: formValue.job || undefined,
      location: formValue.location || undefined,
      playerName: formValue.playerName || undefined,
      status: formValue.status || undefined,
      education: formValue.education || undefined,
      phoneNumber: formValue.phoneNumber || undefined,
    });

    this.closeModal();
  }

  closeModal() {
    this.modalService.closeModal(ModalType.AboutUser);
    this.aboutForm.reset();
  }
}
