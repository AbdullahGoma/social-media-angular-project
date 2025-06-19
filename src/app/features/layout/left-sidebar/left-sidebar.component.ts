import { Component, inject, OnInit } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
  host: {
    '[class.active]': 'sidebarService.leftSidebarVisible()',
  },
})
export class LeftSidebarComponent {
  protected sidebarService = inject(SidebarService);

  toggleSidebar(event: Event): void {
    event.stopPropagation();
    this.sidebarService.toggleSidebar('left');
  }
}
