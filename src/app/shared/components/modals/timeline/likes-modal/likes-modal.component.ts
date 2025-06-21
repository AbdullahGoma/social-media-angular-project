import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../../../core/services/modal.service';
import { ModalType } from '../../../../models/modal-type';
import { LikeService } from '../../../../../core/services/like.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Like } from '../../../../models/like';

@Component({
  selector: 'app-likes-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './likes-modal.component.html',
  styleUrls: ['./likes-modal.component.css'],
})
export class LikesModalComponent {
  private modalService = inject(ModalService);
  private likeService = inject(LikeService);

  private currentId = signal<string | null>(null);
  // Use signals to track which type of likes we're showing
  private modalType = signal<'post' | 'comment'>('post');

  // Combine both like sources
  likes = computed(() => {
    const id = this.currentId();
    const type = this.modalType();

    if (!id) return [];

    return type === 'post'
      ? this.likeService.postLikes().filter((like) => like.postId === id)
      : this.likeService.commentLikes().filter((like) => like.commentId === id);
  });

  isModalOpen = this.modalService.isModalOpen(ModalType.LikesModal);

  private destroyRef = inject(DestroyRef);

  private _effect = effect(
    () => {
      const data = this.modalService.getModalData<{
        id: string;
        type: 'post' | 'comment';
      }>(ModalType.LikesModal)();

      if (data) {
        this.currentId.set(data.id);
        this.modalType.set(data.type);

        // ✅ Call appropriate loader to populate likes
        if (data.type === 'post') {
          this.likeService.loadPostLikes(data.id);
        } else {
          this.likeService.loadCommentLikes(data.id);
        }
      }
    },
    { allowSignalWrites: true }
  );

  closeModal() {
    this.modalService.closeModal(ModalType.LikesModal);
  }
}
