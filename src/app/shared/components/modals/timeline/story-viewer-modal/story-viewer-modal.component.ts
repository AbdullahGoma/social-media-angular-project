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
  private imageLoaded = signal<boolean>(false);

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
      }));
  });

  isModalOpen = toSignal(this.modalService.isModalOpen(ModalType.StoryViewer), {
    initialValue: false,
  });

  constructor() {
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

    // Handle pause state changes
    effect(
      () => {
        if (this.storyService.isPaused()) {
          untracked(() => this.clearProgressInterval());
        } else if (this.storyService.isViewerActive() && !this.isDragging()) {
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
    this.currentProgress.set(0);

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
        this.goToNext();
      }
    };

    this.progressInterval = window.setInterval(updateProgress, 50);
    updateProgress();
  }

  private clearProgressInterval() {
    if (this.progressInterval !== null) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  onImageLoad() {
    this.imageLoaded.set(true);
  }

  onImageError() {
    this.imageLoaded.set(false);
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
      this.goToNext();
    } else if (clickX < width * 0.3) {
      this.goToPrev();
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
