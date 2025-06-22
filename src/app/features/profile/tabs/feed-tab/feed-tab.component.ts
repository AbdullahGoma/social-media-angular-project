import { Component } from '@angular/core';
import { CreatePostBoxComponent } from "../../../../shared/components/create-post-box/create-post-box.component";

@Component({
  selector: 'app-feed-tab',
  standalone: true,
  imports: [CreatePostBoxComponent],
  templateUrl: './feed-tab.component.html',
  styleUrl: './feed-tab.component.css'
})
export class FeedTabComponent {

}
