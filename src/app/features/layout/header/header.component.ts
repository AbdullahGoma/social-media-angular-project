import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private document = inject(DOCUMENT);
  private clickHandler!: (event: Event) => void;

  protected sidebarService = inject(SidebarService);
  protected isUserMenuOpen = signal(false);
  protected isNotificationsOpen = signal(false);

  ngOnInit(): void {
    this.clickHandler = (event: Event) => {
      if (!(event.target as Element).closest('.user-controls')) {
        this.closeAllDropdowns();
      }
    };

    this.document.addEventListener('click', this.clickHandler);
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('click', this.clickHandler);
  }

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
