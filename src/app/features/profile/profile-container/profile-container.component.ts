import { Component } from '@angular/core';
import { ProfileHeaderComponent } from "../profile-header/profile-header.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile-container',
  standalone: true,
  imports: [RouterOutlet, ProfileHeaderComponent],
  templateUrl: './profile-container.component.html',
  styleUrl: './profile-container.component.css'
})
export class ProfileContainerComponent {

}
