import { Component, effect, inject, signal } from '@angular/core';
import { ModalType } from '../../../models/modal-type';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css',
})
export class ConfirmationModalComponent {
  private modalService = inject(ModalService);

  isModalOpen = this.modalService.isModalOpen(ModalType.Confiramation);
  modalData = this.modalService.getModalData<{
    message: string;
    action: () => void;
  }>(ModalType.Confiramation);

  modalMessage = signal<string>('');

  constructor() {
    effect(
      () => {
        if (this.isModalOpen()) {
          this.modalMessage.set(this.modalData().message);
        }
      },
      { allowSignalWrites: true } 
    );
  }

  confirm() {
    const data = this.modalData();
    if (data?.action) {
      data.action();
    }
    this.modalService.closeModal(ModalType.Confiramation);
  }

  cancel() {
    this.modalService.closeModal(ModalType.Confiramation);
  }
}
