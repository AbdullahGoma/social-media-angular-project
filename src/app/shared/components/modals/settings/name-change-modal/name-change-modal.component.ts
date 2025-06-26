import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-name-change-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './name-change-modal.component.html',
  styleUrl: './name-change-modal.component.css',
})
export class NameChangeModalComponent {
  @Output() close = new EventEmitter<void>();
  firstName = signal('John');
  lastName = signal('Doe');

  saveChanges() {
    // Implement name change logic
    console.log('Name changed to:', this.firstName(), this.lastName());
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}
