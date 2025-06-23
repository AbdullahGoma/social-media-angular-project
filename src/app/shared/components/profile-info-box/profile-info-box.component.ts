import { Component, computed, inject, input } from '@angular/core';
import { AboutUserModalComponent } from "../modals/profile/about-modal/about-modal.component";
import { ModalService } from '../../../core/services/modal.service';
import { ModalType } from '../../models/modal-type';
import { UserService } from '../../../core/services/user.service';
import { AboutService } from '../../../core/services/about.service';

@Component({
  selector: 'app-profile-info-box',
  standalone: true,
  imports: [AboutUserModalComponent],
  templateUrl: './profile-info-box.component.html',
  styleUrl: './profile-info-box.component.css',
})
export class ProfileInfoBoxComponent {
  title = input<string>('About');
  private modalService = inject(ModalService);
  private aboutService = inject(AboutService);

  about = this.aboutService.about;
  
  openAboutUserModal() {
    this.modalService.openModal(ModalType.AboutUser);
  }
}
