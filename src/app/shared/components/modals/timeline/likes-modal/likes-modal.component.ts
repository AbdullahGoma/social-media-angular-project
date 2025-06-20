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

  likes$ = this.likeService.likes$;
  likes = signal<Like[] | null>(null);

  isModalOpenSignal = toSignal(
    this.modalService.isModalOpen(ModalType.LikesModal),
    {
      initialValue: false,
    }
  );
  isModalActive = computed(() => this.isModalOpenSignal());

  private destroyReferance = inject(DestroyRef);

  ngOnInit() {
    const subscription = this.likes$.subscribe((likes) => {
      this.likes.set(likes);
    });

    this.destroyReferance.onDestroy(() => subscription.unsubscribe());
  }

  closeModal() {
    this.modalService.closeModal(ModalType.LikesModal);
  }
}
