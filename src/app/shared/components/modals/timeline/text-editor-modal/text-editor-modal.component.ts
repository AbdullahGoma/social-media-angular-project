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

  isModalOpen = toSignal(this.modalService.isModalOpen(ModalType.TextEditor), {
    initialValue: false,
  });

  text = '';
  fontSize = '18px';
  textColor = '#ffffff';
  bgColor = '#000000';
  position: 'top' | 'center' | 'bottom' = 'bottom';

  save() {
    const newStory: StoryItem = {
      id: Date.now().toString(),
      type: 'text',
      content: this.text,
      background: this.bgColor,
      color: this.textColor,
      fontSize: this.fontSize,
      position: this.position,
    };

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
