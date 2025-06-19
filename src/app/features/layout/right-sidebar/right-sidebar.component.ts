import { Component, inject, signal } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.css',
})
export class RightSidebarComponent {
  protected sidebarService = inject(SidebarService);
  protected searchTerm = signal('');
  protected contacts = signal([
    { name: 'Andrei Mashrin', img: 'assets/pic.jpg', status: 'online' },
    { name: 'Aryn Jacobssen', img: 'assets/pic.jpg', status: 'offline' },
    // ... other contacts
  ]);
  protected filteredContacts = signal(this.contacts());

  toggleSidebar(event: Event): void {
    event.stopPropagation();
    this.sidebarService.toggleSidebar('right');
  }

  searchContacts(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input.value.trim().toLowerCase();
    this.searchTerm.set(term);

    if (!term) {
      this.filteredContacts.set(this.contacts());
      return;
    }

    this.filteredContacts.set(
      this.contacts().filter(
        (contact) =>
          contact.name.toLowerCase().includes(term) ||
          contact.status.includes(term)
      )
    );
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.filteredContacts.set(this.contacts());
  }
}
