import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ModalService } from '../../../../../core/services/modal.service';
import { ModalType } from '../../../../models/modal-type';


@Component({
  selector: 'app-image-preview-modal',
  standalone: true,
  templateUrl: './image-preview-modal.component.html',
  styleUrls: ['./image-preview-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ImagePreviewModalComponent {
  private modalService = inject(ModalService);
  private cdRef = inject(ChangeDetectorRef);

  imageUrl: string | null = null;
  isOpen = false;

  constructor() {
    combineLatest([
      toObservable(
        this.modalService.getModalData<string>(ModalType.ImagePreview)
      ),
      toObservable(this.modalService.isModalOpen(ModalType.ImagePreview)),
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([url, open]) => {
        this.imageUrl = url;
        this.isOpen = open;
        this.cdRef.markForCheck();
      });
  }

  closeModal() {
    this.modalService.closeModal(ModalType.ImagePreview);
  }

  downloadImage() {
    if (this.imageUrl) {
      const a = document.createElement('a');
      a.href = this.imageUrl;
      a.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
