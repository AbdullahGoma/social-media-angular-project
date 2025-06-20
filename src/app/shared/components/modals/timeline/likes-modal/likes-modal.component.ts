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

  // Use signals to track which type of likes we're showing
  private modalType = signal<'post' | 'comment'>('post');

  // Combine both like sources
  likes = computed(() => {
    return this.modalType() === 'post'
      ? this.likeService.postLikes()
      : this.likeService.commentLikes();
  });

  isModalOpenSignal = toSignal(
    this.modalService.isModalOpen(ModalType.LikesModal),
    { initialValue: false }
  );

  isModalActive = computed(() => this.isModalOpenSignal());

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    // When modal opens, determine if we're showing post or comment likes
    const sub = this.modalService
      .getModalData<string>(ModalType.LikesModal)
      .subscribe((data) => {
        if (data) {
          // You might want to pass metadata to determine the type
          this.modalType.set('comment'); // or 'post' based on data
        }
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  closeModal() {
    this.modalService.closeModal(ModalType.LikesModal);
  }
}
