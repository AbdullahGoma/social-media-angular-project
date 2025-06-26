import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-change-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-change-modal.component.html',
  styleUrl: './email-change-modal.component.css',
})
export class EmailChangeModalComponent {
  @Output() close = new EventEmitter<void>();
  currentEmail = signal('user@example.com');
  newEmail = signal('');
  confirmEmail = signal('');

  saveChanges() {
    // Implement email change logic
    console.log('Email changed to:', this.newEmail());
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}
