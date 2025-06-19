import { Component } from '@angular/core';
import { LeftSidebarComponent } from "../left-sidebar/left-sidebar.component";
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { RightSidebarComponent } from "../right-sidebar/right-sidebar.component";
import { OverlayComponent } from "../overlay/overlay.component";

@Component({
  selector: 'app-layout-container',
  standalone: true,
  imports: [RouterOutlet, LeftSidebarComponent, HeaderComponent, RightSidebarComponent, OverlayComponent],
  templateUrl: './layout-container.component.html',
  styleUrl: './layout-container.component.css'
})
export class LayoutContainerComponent {

}
