import { Component, ElementRef, ViewChild } from '@angular/core';
import { StoryService } from '../../core/services/story.service';
import { ModalService } from '../../core/services/modal.service';
import { DragScrollService } from '../../core/services/drag-scroll.service';
import { ModalType } from '../../shared/models/modal-type';

@Component({
  selector: 'app-stories',
  standalone: true,
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css'],
})
export class StoriesComponent {
  @ViewChild('storiesScroll') storiesScroll!: ElementRef<HTMLDivElement>;

  constructor(
    public storyService: StoryService,
    private modalService: ModalService,
    private dragScrollService: DragScrollService
  ) {}

  ngAfterViewInit() {
    this.dragScrollService.initialize(this.storiesScroll);
  }

  ngOnDestroy() {
    this.dragScrollService.destroy();
  }

  openStory(story: any, itemIndex: number = 0): void {
    this.modalService.openModal(ModalType.StoryViewer, { story, itemIndex });
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.storyService.addStory({
          id: Date.now().toString(),
          type: 'image',
          url: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
