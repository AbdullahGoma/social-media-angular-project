import { Component, inject } from '@angular/core';
import { CreatePostBoxComponent } from "../../../../shared/components/create-post-box/create-post-box.component";
import { PostService } from '../../../../core/services/post.service';
import { PostsListComponent } from "../../../../shared/components/posts-list/posts-list.component";
import { ProfileInfoBoxComponent } from "../../../../shared/components/profile-info-box/profile-info-box.component";

@Component({
  selector: 'app-feed-tab',
  standalone: true,
  imports: [CreatePostBoxComponent, PostsListComponent, ProfileInfoBoxComponent],
  templateUrl: './feed-tab.component.html',
  styleUrl: './feed-tab.component.css',
})
export class FeedTabComponent {
  posts = inject(PostService).feedPosts;
}
