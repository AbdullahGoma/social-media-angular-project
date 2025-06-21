import { Injectable, signal, computed, effect } from '@angular/core';
import { Story, StoryItem } from '../../shared/models/story';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private _stories = signal<Story[]>(this.getInitialStories());
  private _currentUserIndex = signal<number>(0);
  private _currentStoryItemIndex = signal<number>(0);
  private _isPaused = signal<boolean>(false);
  private _isDeleting = signal<boolean>(false);
  private _isViewerActive = signal<boolean>(false);
  private _progressInterval: any = null;

  // Public signals
  stories = this._stories.asReadonly();
  currentUserIndex = this._currentUserIndex.asReadonly();
  currentStoryItemIndex = this._currentStoryItemIndex.asReadonly();
  isPaused = this._isPaused.asReadonly();
  isDeleting = this._isDeleting.asReadonly();
  isViewerActive = this._isViewerActive.asReadonly();

  private getInitialStories(): Story[] {
    // Load from localStorage if available
    const savedStories = localStorage.getItem('storiesData');
    if (savedStories) {
      return JSON.parse(savedStories);
    }

    return [
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
      // Add more initial stories...
    ];
  }

  // Add this method to handle adding new stories
  addStory(storyItem: StoryItem) {
    const stories = this._stories();
    const myStoryIndex = stories.findIndex(
      (story) => story.user === 'Your Story'
    );

    if (myStoryIndex >= 0) {
      // Add to existing "Your Story"
      stories[myStoryIndex].stories.unshift(storyItem);
      stories[myStoryIndex].viewed = false;
      stories[myStoryIndex].viewedStories = [];
    } else {
      // Create new "Your Story"
      stories.unshift({
        id: Date.now().toString(),
        user: 'Your Story',
        image: 'https://randomuser.me/api/portraits/men/1.jpg', // Default avatar
        stories: [storyItem],
        viewed: false,
        viewedStories: [],
        isMine: true,
      });
    }

    this._stories.set([...stories]);
    this.saveStoriesData();
  }

  openStory(userIndex: number, storyItemIndex: number) {
    this._currentUserIndex.set(userIndex);
    this._currentStoryItemIndex.set(storyItemIndex);
    this._isViewerActive.set(true);
    this._isPaused.set(false);

    // Mark as viewed
    const stories = this._stories();
    if (!stories[userIndex].viewedStories.includes(storyItemIndex)) {
      stories[userIndex].viewedStories.push(storyItemIndex);

      if (
        stories[userIndex].viewedStories.length ===
        stories[userIndex].stories.length
      ) {
        stories[userIndex].viewed = true;
      }

      this._stories.set([...stories]);
      this.saveViewedStories();
    }
  }

  closeStory() {
    this._isViewerActive.set(false);
    this._isPaused.set(false);
    this.clearProgressInterval();
  }

  togglePause() {
    if (this._isDeleting()) return;

    this._isPaused.update((val) => !val);

    if (this._isPaused()) {
      this.clearProgressInterval();
    } else {
      this.startProgress();
    }
  }

  goToNext() {
    if (this._isDeleting()) return;

    const userIndex = this._currentUserIndex();
    const storyItemIndex = this._currentStoryItemIndex();
    const stories = this._stories();

    if (storyItemIndex < stories[userIndex].stories.length - 1) {
      this._currentStoryItemIndex.update((val) => val + 1);
      this.startProgress();
    } else if (userIndex < stories.length - 1) {
      this._currentUserIndex.update((val) => val + 1);
      this._currentStoryItemIndex.set(0);
      this.startProgress();
    } else {
      this.closeStory();
    }
  }

  goToPrev() {
    if (this._isDeleting()) return;

    const userIndex = this._currentUserIndex();
    const storyItemIndex = this._currentStoryItemIndex();
    const stories = this._stories();

    if (storyItemIndex > 0) {
      this._currentStoryItemIndex.update((val) => val - 1);
      this.startProgress();
    } else if (userIndex > 0) {
      this._currentUserIndex.update((val) => val - 1);
      this._currentStoryItemIndex.set(
        stories[userIndex - 1].stories.length - 1
      );
      this.startProgress();
    }
  }

  deleteCurrentStory() {
    this._isDeleting.set(true);
    this.clearProgressInterval();

    const userIndex = this._currentUserIndex();
    const storyItemIndex = this._currentStoryItemIndex();
    const stories = this._stories();

    stories[userIndex].stories.splice(storyItemIndex, 1);

    if (stories[userIndex].stories.length === 0) {
      stories.splice(userIndex, 1);

      if (stories.length === 0) {
        this.closeStory();
        this._stories.set(this.getInitialStories());
        return;
      }

      if (userIndex >= stories.length) {
        this._currentUserIndex.set(stories.length - 1);
      }
    }

    if (storyItemIndex >= stories[this._currentUserIndex()].stories.length) {
      this._currentStoryItemIndex.set(
        Math.max(0, stories[this._currentUserIndex()].stories.length - 1)
      );
    }

    if (stories[this._currentUserIndex()].stories.length > 0) {
      this._stories.set([...stories]);
      this.saveStoriesData();
    } else {
      this.closeStory();
    }

    this._isDeleting.set(false);
  }

  private startProgress() {
    this.clearProgressInterval();

    const duration = 5000; // 5 seconds per story
    const startTime = Date.now();
    const endTime = startTime + duration;

    this._progressInterval = setInterval(() => {
      if (this._isPaused() || this._isDeleting()) return;

      const remaining = endTime - Date.now();

      if (remaining <= 0) {
        this.goToNext();
      }
    }, 100);
  }

  private clearProgressInterval() {
    if (this._progressInterval) {
      clearInterval(this._progressInterval);
      this._progressInterval = null;
    }
  }

  private saveViewedStories() {
    const viewedData = this._stories().reduce((acc, story, index) => {
      acc[index] = {
        viewed: story.viewed,
        viewedStories: story.viewedStories,
      };
      return acc;
    }, {} as Record<number, { viewed: boolean; viewedStories: number[] }>);

    localStorage.setItem('viewedStoriesData', JSON.stringify(viewedData));
  }

  private saveStoriesData() {
    localStorage.setItem('storiesData', JSON.stringify(this._stories()));
  }
}
