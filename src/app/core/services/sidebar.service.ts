import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private leftSidebarState = signal(false);
  private rightSidebarState = signal(false);
  private overlayState = signal(false);

  // Expose signals as read-only
  leftSidebarVisible = this.leftSidebarState.asReadonly();
  rightSidebarVisible = this.rightSidebarState.asReadonly();
  overlayVisible = this.overlayState.asReadonly();

  toggleSidebar(side: 'left' | 'right'): void {
    if (side === 'left') {
      this.leftSidebarState.update((current) => !current);
      this.overlayState.set(this.leftSidebarState());
    } else {
      this.rightSidebarState.update((current) => !current);
      this.overlayState.set(this.rightSidebarState());
    }
  }

  closeSidebars(): void {
    this.leftSidebarState.set(false);
    this.rightSidebarState.set(false);
    this.overlayState.set(false);
  }
}
