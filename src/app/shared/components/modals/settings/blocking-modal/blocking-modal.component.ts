import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-blocking-modal',
  standalone: true,
  imports: [],
  templateUrl: './blocking-modal.component.html',
  styleUrl: './blocking-modal.component.css',
})
export class BlockingModalComponent {
  @Output() close = new EventEmitter<void>();
  blockedUsers = signal([
    { id: 1, name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Mike Johnson', avatar: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Sarah Williams', avatar: 'https://via.placeholder.com/40' },
  ]);

  unblockUser(userId: number) {
    this.blockedUsers.update((users) =>
      users.filter((user) => user.id !== userId)
    );
  }

  closeModal() {
    this.close.emit();
  }
}
