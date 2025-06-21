import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Story, StoryItem } from '../../../../models/story';
import { StoryService } from '../../../../../core/services/story.service';
import { ModalService } from '../../../../../core/services/modal.service';
import { ModalType } from '../../../../models/modal-type';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-story-viewer-modal',
  standalone: true,
  templateUrl: './story-viewer-modal.component.html',
  styleUrls: ['./story-viewer-modal.component.css'],
})
export class StoryViewerModalComponent {
  @ViewChild('storyMedia') storyMedia!: ElementRef<HTMLDivElement>;
  @ViewChild('mediaImg') mediaImg!: ElementRef<HTMLImageElement>;
  @ViewChild('mediaText') mediaText!: ElementRef<HTMLDivElement>;

  currentStory = signal<Story | null>(null);
  currentStoryItem = signal<StoryItem | null>(null);
  currentStoryIndex = 0;
  currentItemIndex = 0;
  isPaused = false;
  progressInterval: any;
  progressValues: number[] = [];
  // Touch/drag handling variables
  private touchStartX = 0;
  private touchStartY = 0;
  private isDragging = false;
  private dragDirection: 'left' | 'right' | null = null;
  private touchStartTime = 0;

  private modalService = inject(ModalService);

  private modalData = toSignal(
    this.modalService.getModalData<{ story: Story; itemIndex: number }>(
      ModalType.StoryViewer
    )
  );

  constructor(private storyService: StoryService) {
    effect(
      () => {
        const data = this.modalData();
        if (data) {
          // Use allowSignalWrites for this effect
          this.currentStory.set(data.story);
          this.currentItemIndex = data.itemIndex;
          this.loadStoryItem();
          this.setupProgressBars();
          this.startProgress();
        }
      },
      { allowSignalWrites: true }
    );
  }

  readonly isModalOpenSignal = toSignal(
    this.modalService.isModalOpen(ModalType.StoryViewer),
    { initialValue: false }
  );

  readonly isModalOpen = computed(() => this.isModalOpenSignal());

  // Handle keyboard navigation
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.currentStory()) return;

    switch (event.key) {
      case 'ArrowRight':
        this.goToNext();
        break;
      case 'ArrowLeft':
        this.goToPrev();
        break;
      case ' ':
      case 'Spacebar':
        this.togglePause();
        break;
      case 'Escape':
        this.closeModal();
        break;
    }
  }

  // Media click handler (for pause/next/prev)
  handleMediaClick(event: MouseEvent): void {
    if (this.isDragging) {
      this.isDragging = false;
      return;
    }

    const rect = this.storyMedia.nativeElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;

    // Center click (30%-70%) - toggle pause
    if (clickX >= width * 0.3 && clickX <= width * 0.7) {
      this.togglePause();
    }
    // Right click (>70%) - next story
    else if (clickX > width * 0.7) {
      this.goToNext();
    }
    // Left click (<30%) - previous story
    else if (clickX < width * 0.3) {
      this.goToPrev();
    }
  }

  // Mouse down handler
  handleMouseDown(event: MouseEvent): void {
    this.touchStartX = event.clientX;
    this.touchStartY = event.clientY;
    this.touchStartTime = Date.now();
    this.isDragging = true;
    this.togglePause(); // Pause while dragging
  }

  // Mouse move handler
  handleMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const xDiff = event.clientX - this.touchStartX;
    const yDiff = event.clientY - this.touchStartY;

    // Determine drag direction if not already set
    if (!this.dragDirection && Math.abs(xDiff) > 10) {
      this.dragDirection = xDiff > 0 ? 'right' : 'left';
      this.storyMedia.nativeElement.classList.add(`drag-${this.dragDirection}`);
    }
  }

  // Mouse up handler
  handleMouseUp(event: MouseEvent): void {
    if (!this.isDragging) return;

    const xDiff = event.clientX - this.touchStartX;
    const timeDiff = Date.now() - this.touchStartTime;

    // If significant horizontal drag (>100px) and fast enough (<500ms)
    if (Math.abs(xDiff) > 100 && timeDiff < 500 && this.dragDirection) {
      if (this.dragDirection === 'right') {
        this.goToPrev();
      } else {
        this.goToNext();
      }
    }

    this.resetDragState();
    this.togglePause(); // Resume after drag
  }

  // Touch start handler
  handleTouchStart(event: TouchEvent): void {
    if (event.touches.length > 1) return; // Ignore multi-touch

    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
    this.isDragging = true;
    this.togglePause(); // Pause while dragging
  }

  // Touch move handler
  handleTouchMove(event: TouchEvent): void {
    if (!this.isDragging || event.touches.length > 1) return;

    const touch = event.touches[0];
    const xDiff = touch.clientX - this.touchStartX;
    const yDiff = touch.clientY - this.touchStartY;

    // Prevent vertical scroll if horizontal drag detected
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      event.preventDefault();
    }

    // Determine drag direction if not already set
    if (!this.dragDirection && Math.abs(xDiff) > 10) {
      this.dragDirection = xDiff > 0 ? 'right' : 'left';
      this.storyMedia.nativeElement.classList.add(`drag-${this.dragDirection}`);
    }
  }

  // Touch end handler
  handleTouchEnd(event: TouchEvent): void {
    if (!this.isDragging) return;

    const touch = event.changedTouches[0];
    const xDiff = touch.clientX - this.touchStartX;
    const timeDiff = Date.now() - this.touchStartTime;

    // If significant horizontal drag (>100px) and fast enough (<500ms)
    if (Math.abs(xDiff) > 100 && timeDiff < 500 && this.dragDirection) {
      if (this.dragDirection === 'right') {
        this.goToPrev();
      } else {
        this.goToNext();
      }
    }

    this.resetDragState();
    this.togglePause(); // Resume after drag
  }

  // Image load handler
  onImageLoad(): void {
    this.storyMedia.nativeElement.classList.remove('loading');
    if (this.currentStory()) {
      this.startProgress();
    }
  }

  // Image error handler
  onImageError(): void {
    this.storyMedia.nativeElement.classList.remove('loading');
    console.error('Failed to load story image');
    this.goToNext(); // Skip to next if current fails to load
  }

  // Reset drag state
  private resetDragState(): void {
    if (this.dragDirection) {
      this.storyMedia.nativeElement.classList.remove(
        `drag-${this.dragDirection}`
      );
    }
    this.isDragging = false;
    this.dragDirection = null;
  }

  openStory(story: Story, itemIndex: number = 0): void {
    this.currentStory.set(story);
    this.currentItemIndex = itemIndex;
    this.loadStoryItem();
    this.setupProgressBars();
    this.startProgress();
  }

  private loadStoryItem(): void {
    const story = this.currentStory();
    if (!story) return;

    this.currentStoryItem.set(story.stories[this.currentItemIndex]);
    this.storyService.markStoryViewed(story.id, this.currentItemIndex);

    const item = this.currentStoryItem();
    if (!item) return;

    if (item.type === 'image' || item.type === 'image-text') {
      this.mediaImg.nativeElement.src = item.url || '';
      this.mediaImg.nativeElement.style.display = 'block';
      this.mediaText.nativeElement.style.display = 'none';
    } else if (item.type === 'text') {
      this.mediaImg.nativeElement.style.display = 'none';
      this.mediaText.nativeElement.style.display = 'block';
      this.mediaText.nativeElement.textContent = item.content || '';
      this.mediaText.nativeElement.style.color = item.color || '#ffffff';
      this.mediaText.nativeElement.style.fontSize = item.fontSize || '18px';
      this.mediaText.nativeElement.className = `story-text-content text-${
        item.position || 'center'
      }`;
      this.storyMedia.nativeElement.style.background =
        item.background || '#000000';
    }
  }

  private setupProgressBars(): void {
    const story = this.currentStory();
    if (!story) return;

    this.progressValues = story.stories.map((_, i) =>
      i < this.currentItemIndex ? 100 : 0
    );
  }

  private startProgress(): void {
    if (this.progressInterval) clearInterval(this.progressInterval);

    this.progressInterval = setInterval(() => {
      if (this.isPaused) return;

      const currentProgress = this.progressValues[this.currentItemIndex] || 0;
      const newProgress = currentProgress + (100 / 5000) * 100; // 5 seconds per story

      if (newProgress >= 100) {
        this.goToNext();
      } else {
        this.progressValues[this.currentItemIndex] = newProgress;
      }
    }, 100);
  }

  goToNext(): void {
    const story = this.currentStory();
    if (!story) return;

    if (this.currentItemIndex < story.stories.length - 1) {
      this.currentItemIndex++;
      this.loadStoryItem();
      this.setupProgressBars();
    } else if (
      this.currentStoryIndex <
      this.storyService.storiesSignal().length - 1
    ) {
      this.currentStoryIndex++;
      this.currentItemIndex = 0;
      this.currentStory.set(
        this.storyService.storiesSignal()[this.currentStoryIndex]
      );
      this.loadStoryItem();
      this.setupProgressBars();
    } else {
      this.closeModal();
    }
  }

  goToPrev(): void {
    if (this.currentItemIndex > 0) {
      this.currentItemIndex--;
      this.loadStoryItem();
      this.setupProgressBars();
    } else if (this.currentStoryIndex > 0) {
      this.currentStoryIndex--;
      this.currentStory.set(
        this.storyService.storiesSignal()[this.currentStoryIndex]
      );
      this.currentItemIndex = this.currentStory()?.stories.length
        ? this.currentStory()!.stories.length - 1
        : 0;
      this.loadStoryItem();
      this.setupProgressBars();
    }
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      clearInterval(this.progressInterval);
    } else {
      this.startProgress();
    }
  }

  closeModal(): void {
    clearInterval(this.progressInterval);
    this.modalService.closeModal(ModalType.StoryViewer);
  }
}
