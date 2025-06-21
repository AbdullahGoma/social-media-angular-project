import { Component, inject } from '@angular/core';
import { ModalService } from '../../../../../core/services/modal.service';
import { StoryService } from '../../../../../core/services/story.service';
import { StoryItem } from '../../../../models/story';
import { ModalType } from '../../../../models/modal-type';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-text-editor-modal',
  standalone: true,
  templateUrl: './text-editor-modal.component.html',
  styleUrls: ['./text-editor-modal.component.css'],
  imports: [FormsModule],
})
export class TextEditorModalComponent {
  private modalService = inject(ModalService);
  private storyService = inject(StoryService);

  isModalOpen = this.modalService.isModalOpen(ModalType.TextEditor);
  modalData = this.modalService.getModalData<any>(ModalType.TextEditor);

  text = '';
  fontSize = '18px';
  textColor = '#ffffff';
  bgColor = '#000000';
  position: 'top' | 'center' | 'bottom' = 'bottom';
  imageUrl: string | null = null;
  storyType: 'text' | 'image' | 'image-text' = 'text';

  constructor() {
    // Get the image URL if passed from the story type modal
    const data = this.modalData();
    if (data?.imageUrl) {
      this.imageUrl = data.imageUrl;
      this.storyType = 'image-text';
    } else if (data?.type) {
      this.storyType = data.type;
    }
  }

  save() {
    let newStory: StoryItem;

    if (this.storyType === 'text') {
      newStory = {
        id: Date.now().toString(),
        type: 'text',
        content: this.text,
        background: this.bgColor,
        color: this.textColor,
        fontSize: this.fontSize,
        position: this.position,
        createdAt: new Date().toISOString(),
      };
    } else if (this.storyType === 'image-text' && this.imageUrl) {
      newStory = {
        id: Date.now().toString(),
        type: 'image-text',
        url: this.imageUrl,
        text: this.text,
        color: this.textColor,
        fontSize: this.fontSize,
        position: this.position,
        createdAt: new Date().toISOString(),
      };
    } else {
      return;
    }

    // Add to stories
    this.storyService.addStory(newStory);
    this.close();
  }

  close() {
    this.modalService.closeModal(ModalType.TextEditor);
  }

  selectPosition(pos: 'top' | 'center' | 'bottom') {
    this.position = pos;
  }
}
