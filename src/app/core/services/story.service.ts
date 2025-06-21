// story.service.ts
import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Story, StoryItem } from '../../shared/models/story';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  public readonly storiesSignal = signal<Story[]>([]);
  stories$ = toObservable(this.storiesSignal);

  constructor() {
    this.loadMockStories();
  }

  private loadMockStories(): void {
    const mockStories: Story[] = [
      {
        id: '1',
        user: 'John Doe',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        stories: [
          {
            id: '1-1',
            type: 'image',
            url: 'https://picsum.photos/800/1600?random=1',
          },
          {
            id: '1-2',
            type: 'image',
            url: 'https://picsum.photos/800/1600?random=11',
          },
          {
            id: '1-3',
            type: 'image',
            url: 'https://picsum.photos/800/1600?random=12',
          },
        ],
        viewed: false,
        viewedStories: [],
        isMine: false,
      },
      // Add more mock stories...
    ];
    this.storiesSignal.set(mockStories);
  }

  addStory(storyItem: StoryItem): void {
    const currentStories = this.storiesSignal();
    const yourStoryIndex = currentStories.findIndex((story) => story.isMine);

    if (yourStoryIndex >= 0) {
      const updatedStories = [...currentStories];
      updatedStories[yourStoryIndex].stories.unshift(storyItem);
      updatedStories[yourStoryIndex].viewed = false;
      updatedStories[yourStoryIndex].viewedStories = [];
      this.storiesSignal.set(updatedStories);
    } else {
      this.storiesSignal.set([
        {
          id: Date.now().toString(),
          user: 'Your Story',
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
          stories: [storyItem],
          viewed: false,
          viewedStories: [],
          isMine: true,
        },
        ...currentStories,
      ]);
    }
  }

  markStoryViewed(storyId: string, itemIndex: number): void {
    const stories = this.storiesSignal().map((story) => {
      if (story.id === storyId) {
        const viewedStories = [...story.viewedStories];
        if (!viewedStories.includes(itemIndex)) {
          viewedStories.push(itemIndex);
        }
        return {
          ...story,
          viewedStories,
          viewed: viewedStories.length === story.stories.length,
        };
      }
      return story;
    });
    this.storiesSignal.set(stories);
  }
}
