import { computed, Injectable, signal } from '@angular/core';
import { ModalType } from '../../shared/models/modal-type';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  // Use signals instead of BehaviorSubject
  private activeModals = signal<ModalType[]>([]);
  private modalData = signal<{ [key: string]: any }>({});

  // Computed signals for derived state
  activeModalsList = computed(() => this.activeModals());
  modalDataMap = computed(() => this.modalData());

  // Check if a specific modal is open
  isModalOpen(modalName: ModalType) {
    return computed(() => this.activeModals().includes(modalName));
  }

  // Get data for a specific modal
  getModalData<T>(modalName: ModalType) {
    return computed(() => this.modalData()[modalName] as T);
  }

  // Open a modal with optional data
  openModal(modalName: ModalType, data?: any) {
    const currentModals = this.activeModals();
    if (!currentModals.includes(modalName)) {
      this.activeModals.set([...currentModals, modalName]);
      if (data) {
        this.modalData.update((currentData) => ({
          ...currentData,
          [modalName]: data,
        }));
      }
    }
  }

  // Close a modal
  closeModal(modalName: ModalType) {
    this.activeModals.update((currentModals) =>
      currentModals.filter((m) => m !== modalName)
    );
  }

  // Set data for a specific modal
  setModalData(modalName: ModalType, data: any) {
    this.modalData.update((currentData) => ({
      ...currentData,
      [modalName]: data,
    }));
  }
}
