import { Component } from '@angular/core';
import { ProfileInfoBoxComponent } from "../../../../shared/components/profile-info-box/profile-info-box.component";

@Component({
  selector: 'app-about-tab',
  standalone: true,
  imports: [ProfileInfoBoxComponent],
  templateUrl: './about-tab.component.html',
  styleUrl: './about-tab.component.css'
})
export class AboutTabComponent {

}
