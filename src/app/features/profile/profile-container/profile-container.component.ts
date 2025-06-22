import { Component } from '@angular/core';
import { ProfileHeaderComponent } from "../profile-header/profile-header.component";

@Component({
  selector: 'app-profile-container',
  standalone: true,
  imports: [ProfileHeaderComponent],
  templateUrl: './profile-container.component.html',
  styleUrl: './profile-container.component.css'
})
export class ProfileContainerComponent {

}
