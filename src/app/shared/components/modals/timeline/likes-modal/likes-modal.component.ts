import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
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

    if (type === 'post') {
      return this.likeService.postLikes().filter((like) => like.postId === id);
    } else {
      return this.likeService
        .commentLikes()
        .filter((like) => like.commentId === id);
    }
  });

  isModalOpenSignal = toSignal(
    this.modalService.isModalOpen(ModalType.LikesModal),
    { initialValue: false }
  );

  isModalActive = computed(() => this.isModalOpenSignal());

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const sub = this.modalService
      .getModalData<{ id: string; type: 'post' | 'comment' }>(
        ModalType.LikesModal
      )
      .subscribe((data) => {
        if (data) {
          this.currentId.set(data.id);
          this.modalType.set(data.type);

          // Load the appropriate likes
          if (data.type === 'post') {
            this.likeService.loadPostLikes(data.id);
          } else {
            this.likeService.loadCommentLikes(data.id);
          }
        }
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  closeModal() {
    this.modalService.closeModal(ModalType.LikesModal);
  }
}
