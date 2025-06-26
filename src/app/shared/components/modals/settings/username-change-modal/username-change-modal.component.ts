import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-username-change-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './username-change-modal.component.html',
  styleUrl: './username-change-modal.component.css',
})
export class UsernameChangeModalComponent {
  @Output() close = new EventEmitter<void>();
  newUsername = signal('johndoe');

  saveChanges() {
    // Implement username change logic
    console.log('Username changed to:', this.newUsername());
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}
