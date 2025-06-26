import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-change-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-change-modal.component.html',
  styleUrl: './password-change-modal.component.css',
})
export class PasswordChangeModalComponent {
  @Output() close = new EventEmitter<void>();
  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  saveChanges() {
    // Implement password change logic
    console.log('Password changed');
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}
