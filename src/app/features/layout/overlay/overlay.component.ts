import { Component, inject } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.css',
  host: {
    '[class.active]': 'sidebarService.overlayVisible()',
  },
})
export class OverlayComponent {
  protected sidebarService = inject(SidebarService);

  closeSidebars(): void {
    this.sidebarService.closeSidebars();
  }
}
