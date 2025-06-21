import {
  Component,
  inject,
  effect,
  computed,
  signal,
  OnDestroy,
  untracked,
} from '@angular/core';
import { StoryService } from '../../../../../core/services/story.service';
import { ModalService } from '../../../../../core/services/modal.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModalType } from '../../../../models/modal-type';

@Component({
  selector: 'app-story-viewer-modal',
  standalone: true,
  templateUrl: './story-viewer-modal.component.html',
  styleUrls: ['./story-viewer-modal.component.css'],
})
export class StoryViewerModalComponent implements OnDestroy {
  private storyService = inject(StoryService);
  private modalService = inject(ModalService);

  // State signals
  currentProgress = signal<number>(0);
  private progressInterval: number | null = null;
  protected isDragging = signal<boolean>(false);
  private touchStartX = signal<number>(0);
  private touchStartY = signal<number>(0);
  private startTime = signal<number>(0);
  protected imageLoaded = signal<boolean>(false);

  // Computed values
  currentUser = computed(() => {
    const stories = this.storyService.stories();
    const userIndex = this.storyService.currentUserIndex();
    return stories[userIndex] ?? null;
  });

  currentStory = computed(() => {
    const user = this.currentUser();
    if (!user) return null;
    const storyIndex = this.storyService.currentStoryItemIndex();
    return user.stories[storyIndex] ?? null;
  });

  progressBars = computed(() => {
    const user = this.currentUser();
    if (!user) return [];

    const currentIndex = this.storyService.currentStoryItemIndex();
    return Array(user.stories.length)
      .fill(0)
      .map((_, i) => ({
        width:
          i < currentIndex
            ? '100%'
            : i === currentIndex
            ? `${this.currentProgress()}%`
            : '0%',
        transition: this.isDragging() ? 'none' : 'width linear',
      }));
  });

  isModalOpen = this.modalService.isModalOpen(ModalType.StoryViewer);

  constructor() {
    // Handle viewer activation
    effect(
      () => {
        if (this.storyService.isViewerActive()) {
          this.imageLoaded.set(false); // Reset loaded state when viewer activates
        }
      },
      { allowSignalWrites: true }
    );

    // Auto-start progress when viewer becomes active
    effect(
      () => {
        if (this.storyService.isViewerActive()) {
          untracked(() => this.startProgress());
        } else {
          untracked(() => this.clearProgressInterval());
        }
      },
      { allowSignalWrites: true }
    );

    // Handle story index changes
    effect(() => {
      const index = this.storyService.currentStoryItemIndex();
      untracked(() => {
        this.currentProgress.set(0);
        this.imageLoaded.set(false); // Reset loaded state when story changes
      });
    });

    // Handle pause state changes
    effect(
      () => {
        if (this.storyService.isPaused()) {
          untracked(() => this.clearProgressInterval());
        } else if (
          this.storyService.isViewerActive() &&
          !this.isDragging() &&
          this.imageLoaded()
        ) {
          untracked(() => this.startProgress());
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnDestroy() {
    this.clearProgressInterval();
  }

  private startProgress() {
    this.clearProgressInterval();

    // Don't start if image isn't loaded or viewer is paused
    if (!this.imageLoaded() || this.storyService.isPaused()) {
      return;
    }

    this.clearProgressInterval();
    this.currentProgress.set(0);
    this.startTime.set(Date.now());

    const duration = 5000; // 5 seconds per story
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      if (this.storyService.isPaused() || this.storyService.isDeleting())
        return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      this.currentProgress.set(progress);

      if (progress >= 100) {
        this.checkAndHandleStoryEnd();
      }
    };

    this.progressInterval = window.setInterval(updateProgress, 50);
    updateProgress();
  }

  private checkAndHandleStoryEnd() {
    const stories = this.storyService.stories();
    const userIndex = this.storyService.currentUserIndex();
    const storyIndex = this.storyService.currentStoryItemIndex();

    // If we're not at the end, let the service handle navigation
    if (
      storyIndex < stories[userIndex].stories.length - 1 ||
      userIndex < stories.length - 1
    ) {
      this.storyService.goToNext();
    } else {
      // We're at the very end - close the viewer
      this.closeStory();
    }
  }

  private clearProgressInterval() {
    if (this.progressInterval !== null) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  onImageLoad() {
    this.imageLoaded.set(true);
    if (!this.storyService.isPaused()) {
      this.startProgress();
    }
  }

  onImageError() {
    this.imageLoaded.set(true); // Treat error as loaded to prevent hanging
    if (!this.storyService.isPaused()) {
      this.startProgress();
    }
  }

  // Public methods
  closeStory() {
    this.storyService.closeStory();
    this.modalService.closeModal(ModalType.StoryViewer);
  }

  togglePause() {
    this.storyService.togglePause();
  }

  goToNext() {
    this.storyService.goToNext();
  }

  goToPrev() {
    this.storyService.goToPrev();
  }

  deleteStory() {
    this.storyService.deleteCurrentStory();
  }

  // Event handlers
  handleClick(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;

    if (clickX >= width * 0.3 && clickX <= width * 0.7) {
      this.togglePause();
    } else if (clickX > width * 0.7) {
      // This will now properly handle end-of-stories case
      this.storyService.goToNext();
    } else if (clickX < width * 0.3) {
      this.storyService.goToPrev();
    }
  }

  handleTouchStart(event: TouchEvent) {
    this.isDragging.set(true);
    this.touchStartX.set(event.touches[0].clientX);
    this.touchStartY.set(event.touches[0].clientY);
    this.togglePause();
  }

  handleTouchMove(event: TouchEvent) {
    if (!this.isDragging()) return;

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const deltaX = touchX - this.touchStartX();
    const deltaY = touchY - this.touchStartY();

    // Vertical swipe down to close
    if (deltaY > 50 && Math.abs(deltaX) < 30) {
      this.closeStory();
      return;
    }

    // Horizontal swipe detection
    if (Math.abs(deltaX) > 30) {
      event.preventDefault();
    }
  }

  handleTouchEnd(event: TouchEvent) {
    if (!this.isDragging()) return;

    const touchX = event.changedTouches[0].clientX;
    const deltaX = touchX - this.touchStartX();

    if (deltaX > 50) {
      this.goToPrev();
    } else if (deltaX < -50) {
      this.goToNext();
    }

    this.isDragging.set(false);
    this.togglePause();
  }
}
