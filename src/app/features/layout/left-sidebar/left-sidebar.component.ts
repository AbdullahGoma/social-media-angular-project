import { Component, inject } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
})
export class LeftSidebarComponent {
  protected sidebarService = inject(SidebarService);

  toggleSidebar(event: Event): void {
    event.stopPropagation();
    this.sidebarService.toggleSidebar('left');
  }
}
