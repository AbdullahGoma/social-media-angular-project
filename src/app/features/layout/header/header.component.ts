import { Component, inject, signal } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  protected sidebarService = inject(SidebarService);
  protected isUserMenuOpen = signal(false);
  protected isNotificationsOpen = signal(false);

  toggleUserMenu(event: Event): void {
    event.preventDefault();
    this.isUserMenuOpen.update((current) => !current);
    if (this.isUserMenuOpen()) {
      this.isNotificationsOpen.set(false);
    }
  }

  toggleNotifications(event: Event): void {
    event.preventDefault();
    this.isNotificationsOpen.update((current) => !current);
    if (this.isNotificationsOpen()) {
      this.isUserMenuOpen.set(false);
    }
  }

  closeAllDropdowns(): void {
    this.isUserMenuOpen.set(false);
    this.isNotificationsOpen.set(false);
  }
}
