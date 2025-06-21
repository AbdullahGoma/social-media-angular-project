import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { StoryService } from '../../core/services/story.service';
import { DragScrollService } from '../../core/services/drag-scroll.service';
import { ModalService } from '../../core/services/modal.service';
import { ModalType } from '../../shared/models/modal-type';
import { StoryItem } from '../../shared/models/story';
import { StoryTypeModalComponent } from "../../shared/components/modals/timeline/story-type-modal/story-type-modal.component";

@Component({
  selector: 'app-stories',
  standalone: true,
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css'],
  imports: [StoryTypeModalComponent],
})
export class StoriesComponent {
  @ViewChild('storiesScroll') storiesScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  private storyService = inject(StoryService);
  private dragScrollService = inject(DragScrollService);
  private modalService = inject(ModalService);

  stories = this.storyService.stories;
  private selectedType: 'image' | 'text' | 'image-text' = 'image';

  ngAfterViewInit() {
    this.dragScrollService.initialize(this.storiesScroll);
  }

  ngOnDestroy() {
    this.dragScrollService.destroy();
  }

  openStory(index: number) {
    this.storyService.openStory(index, 0);
    this.modalService.openModal(ModalType.StoryViewer);
  }

  openAddStoryModal() {
    this.modalService.openModal(ModalType.StoryType);
  }

  onTypeSelected(type: 'image' | 'text' | 'image-text') {
    this.selectedType = type;
    if (type !== 'text') {
      // Trigger file input after a small delay to ensure modal is closed
      setTimeout(() => {
        this.fileInput.nativeElement.click();
      }, 100);
    }
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const storyType =
          this.modalService.getModalData<{ type: string }>(
            ModalType.StoryType
          )()?.type || 'image';

        if (storyType === 'image') {
          // Create image-only story immediately
          const newStory: StoryItem = {
            id: Date.now().toString(),
            type: 'image',
            url: imageUrl,
          };
          this.storyService.addStory(newStory);
        } else {
          // Open text editor for image with text
          this.modalService.openModal(ModalType.TextEditor, {
            imageUrl,
            type: 'image-text',
          });
        }
      };

      reader.readAsDataURL(file);
      input.value = ''; // Reset input
    }
  }
}
