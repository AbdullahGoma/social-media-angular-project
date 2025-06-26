import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us-modal.component.html',
  styleUrl: './contact-us-modal.component.css',
})
export class ContactUsModalComponent {
  @Output() close = new EventEmitter<void>();
  subject = signal('');
  message = signal('');

  sendMessage() {
    // Implement contact form submission
    console.log('Message sent:', this.subject(), this.message());
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}