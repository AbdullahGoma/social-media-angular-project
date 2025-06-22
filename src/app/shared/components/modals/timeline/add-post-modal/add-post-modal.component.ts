import {
  Component,
  inject,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../../../core/services/modal.service';
import { ModalType } from '../../../../models/modal-type';
import { PostService } from '../../../../../core/services/post.service';

@Component({
  selector: 'app-add-post-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-post-modal.component.html',
  styleUrls: ['./add-post-modal.component.css'],
})
export class AddPostModalComponent {
  private modalService = inject(ModalService);
  private postService = inject(PostService);

  // Form state
  postText = signal('');
  audience = signal('public');
  feeling = signal<string | null>(null);
  status = signal<string | null>(null);
  mediaFiles = signal<{ file: File; preview: string }[]>([]);
  MAX_IMAGES = 4;

  isModalOpen = this.modalService.isModalOpen(ModalType.AddPost);

  // Dropdown states
  showAudienceDropdown = false;
  showFeelingDropdown = false;
  showStatusDropdown = false;

  // Template references
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Audience options
  audienceOptions = [
    { value: 'public', label: 'Public', icon: '🌎' },
    { value: 'friends', label: 'Friends', icon: '👥' },
    { value: 'only-me', label: 'Only me', icon: '🔒' },
  ];

  // Feeling options
  feelingOptions = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'angry', emoji: '😠', label: 'Angry' },
    { value: 'loved', emoji: '🥰', label: 'Loved' },
    { value: 'blessed', emoji: '🙏', label: 'Blessed' },
    { value: 'excited', emoji: '🤩', label: 'Excited' },
  ];

  // Status options
  statusOptions = [
    { value: 'watching', emoji: '📺', label: 'Watching' },
    { value: 'listening', emoji: '🎧', label: 'Listening to' },
    { value: 'traveling', emoji: '✈️', label: 'Traveling to' },
    { value: 'eating', emoji: '🍽️', label: 'Eating' },
    { value: 'reading', emoji: '📖', label: 'Reading' },
    { value: 'celebrating', emoji: '🎉', label: 'Celebrating' },
  ];

  // Check if post can be submitted
  canSubmit() {
    return (
      this.postText().trim().length > 0 ||
      this.mediaFiles().length > 0 ||
      this.feeling() !== null ||
      this.status() !== null
    );
  }

  // Handle file selection
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const remainingSlots = this.MAX_IMAGES - this.mediaFiles().length;
    if (remainingSlots <= 0) return;

    const files = Array.from(input.files).slice(0, remainingSlots);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.mediaFiles.update((files) => [
          ...files,
          { file, preview: e.target?.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });

    input.value = ''; // Reset input
  }

  // Trigger file input
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // Remove media file
  removeMedia(index: number) {
    this.mediaFiles.update((files) => files.filter((_, i) => i !== index));
  }

  // Select audience
  selectAudience(value: string) {
    this.audience.set(value);
    this.showAudienceDropdown = false;

    // Force change detection
    setTimeout(() => {}, 0);
  }

  // Get audience icon
  getAudienceIcon() {
    return (
      this.audienceOptions.find((a) => a.value === this.audience())?.icon ||
      '🌎'
    );
  }

  toggleFeelingDropdown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.showFeelingDropdown = !this.showFeelingDropdown;
  }

  toggleStatusDropdown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.showStatusDropdown = !this.showStatusDropdown;
  }

  toggleAudienceDropdown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.showAudienceDropdown = !this.showAudienceDropdown;
  }

  // Select feeling
  selectFeeling(value: string) {
    this.feeling.set(value);
    this.showFeelingDropdown = false;
    // Force change detection if needed
    setTimeout(() => {}, 0);
  }

  // Remove feeling
  removeFeeling() {
    this.feeling.set(null);
  }

  // Select status
  selectStatus(value: string) {
    this.status.set(value);
    this.showStatusDropdown = false;
    // Force change detection if needed
    setTimeout(() => {}, 0);
  }

  // Remove status
  removeStatus() {
    this.status.set(null);
  }

  // Close modal
  closeModal() {
    this.modalService.closeModal(ModalType.AddPost);
  }

  // Submit post
  submitPost() {
    const postData = {
      author: {
        name: 'Abdullah Gomaa',
        avatar:
          'https://res.cloudinary.com/dzqc5nfai/image/upload/v1743787413/tasiqt2dkqhjjmomflna.jpg',
      },
      content: this.postText().trim(),
      images: this.mediaFiles().map((f) => f.preview),
      feeling: this.feeling()
        ? {
            emoji:
              this.feelingOptions.find((f) => f.value === this.feeling())
                ?.emoji || '',
            label:
              this.feelingOptions.find((f) => f.value === this.feeling())
                ?.label || '',
          }
        : undefined,
      status: this.status()
        ? {
            emoji:
              this.statusOptions.find((s) => s.value === this.status())
                ?.emoji || '',
            label:
              this.statusOptions.find((s) => s.value === this.status())
                ?.label || '',
          }
        : undefined,
      date: this.formatCurrentDate(),
    };

    this.postService.addPost(postData);
    this.closeModal();
    this.resetForm();
  }

  private formatCurrentDate(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const timeString = now.toLocaleTimeString('en-US', options);
    return `${timeString} • Today`;
  }

  // Reset form
  private resetForm() {
    this.postText.set('');
    this.mediaFiles.set([]);
    this.audience.set('public');
    this.feeling.set(null);
    this.status.set(null);
  }

  // Get selected feeling display
  getSelectedFeeling() {
    const selected = this.feelingOptions.find(
      (f) => f.value === this.feeling()
    );
    return selected ? selected.emoji : 'Feeling';
  }

  // Get selected status display
  getSelectedStatus() {
    const selected = this.statusOptions.find((s) => s.value === this.status());
    return selected ? selected.emoji : 'Status';
  }

  // Get feeling label
  getFeelingLabel() {
    const selected = this.feelingOptions.find(
      (f) => f.value === this.feeling()
    );
    return selected ? `${selected.emoji} ${selected.label}` : '';
  }

  // Get status label
  getStatusLabel() {
    const selected = this.statusOptions.find((s) => s.value === this.status());
    return selected ? `${selected.emoji} ${selected.label}` : '';
  }

  // Get audience label
  getAudienceLabel() {
    const selected = this.audienceOptions.find(
      (a) => a.value === this.audience()
    );
    return selected ? selected.label : 'Public';
  }

  previewImage(imageUrl: string) {
    this.modalService.openModal(ModalType.ImagePreview, imageUrl);
  }
}
