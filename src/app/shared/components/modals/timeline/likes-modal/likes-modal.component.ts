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
  private destroyRef = inject(DestroyRef);

  private currentId = signal<string | null>(null);
  private modalType = signal<'post' | 'comment'>('post');

  // FIXED: Better computed logic with null checks
  likes = computed(() => {
    const id = this.currentId();
    const type = this.modalType();

    if (!id) return [];

    const likes =
      type === 'post'
        ? this.likeService.postLikes()
        : this.likeService.commentLikes();

    return likes || [];
  });

  isModalOpen = this.modalService.isModalOpen(ModalType.LikesModal);

  // FIXED: Simplified effect with better error handling
  private modalEffect = effect(
    () => {
      const data = this.modalService.getModalData<{
        id: string;
        type: 'post' | 'comment';
      }>(ModalType.LikesModal)();

      if (data && data.id && data.type) {
        this.currentId.set(data.id);
        this.modalType.set(data.type);

        // Load appropriate likes
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
    this.currentId.set(null);
  }
}
