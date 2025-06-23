import { Component } from '@angular/core';
import { ProfileInfoBoxComponent } from "../../../../shared/components/profile-info-box/profile-info-box.component";
import { EventsComponent } from "../../../../shared/components/events/events.component";
import { PagesComponent } from "../../../../shared/components/pages/pages.component";

@Component({
  selector: 'app-about-tab',
  standalone: true,
  imports: [ProfileInfoBoxComponent, EventsComponent, PagesComponent],
  templateUrl: './about-tab.component.html',
  styleUrl: './about-tab.component.css'
})
export class AboutTabComponent {

}
