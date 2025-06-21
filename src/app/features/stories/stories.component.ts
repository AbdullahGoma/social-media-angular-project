import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { StoryService } from '../../core/services/story.service';
import { DragScrollService } from '../../core/services/drag-scroll.service';
import { ModalService } from '../../core/services/modal.service';
import { ModalType } from '../../shared/models/modal-type';

@Component({
  selector: 'app-stories',
  standalone: true,
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css'],
})
export class StoriesComponent {
  @ViewChild('storiesScroll') storiesScroll!: ElementRef<HTMLDivElement>;

  private storyService = inject(StoryService);
  private dragScrollService = inject(DragScrollService);
  private modalService = inject(ModalService);

  stories = this.storyService.stories;

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
}
