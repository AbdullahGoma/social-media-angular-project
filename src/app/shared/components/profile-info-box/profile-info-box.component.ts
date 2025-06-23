import { Component, input } from '@angular/core';

@Component({
  selector: 'app-profile-info-box',
  standalone: true,
  imports: [],
  templateUrl: './profile-info-box.component.html',
  styleUrl: './profile-info-box.component.css',
})
export class ProfileInfoBoxComponent {
  title = input<string>('About');
}
