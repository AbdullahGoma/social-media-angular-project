import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-profile-lock-modal',
  standalone: true,
  imports: [],
  templateUrl: './profile-lock-modal.component.html',
  styleUrl: './profile-lock-modal.component.css',
})
export class ProfileLockModalComponent {
  @Output() close = new EventEmitter<void>();

  lockProfile() {
    // Implement lock profile logic
    this.closeModal();
  }

  unlockProfile() {
    // Implement unlock profile logic
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}
