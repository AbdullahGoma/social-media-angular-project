import { Component, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLockModalComponent } from "../../../shared/components/modals/settings/profile-lock-modal/profile-lock-modal.component";
import { BlockingModalComponent } from "../../../shared/components/modals/settings/blocking-modal/blocking-modal.component";
import { EmailChangeModalComponent } from "../../../shared/components/modals/settings/email-change-modal/email-change-modal.component";
import { PasswordChangeModalComponent } from "../../../shared/components/modals/settings/password-change-modal/password-change-modal.component";
import { TwoFactorAuthModalComponent } from "../../../shared/components/modals/settings/two-factor-auth-modal/two-factor-auth-modal.component";
import { NameChangeModalComponent } from "../../../shared/components/modals/settings/name-change-modal/name-change-modal.component";
import { UsernameChangeModalComponent } from "../../../shared/components/modals/settings/username-change-modal/username-change-modal.component";
import { ContactUsModalComponent } from "../../../shared/components/modals/settings/contact-us-modal/contact-us-modal.component";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    ProfileLockModalComponent,
    BlockingModalComponent,
    EmailChangeModalComponent,
    PasswordChangeModalComponent,
    TwoFactorAuthModalComponent,
    NameChangeModalComponent,
    UsernameChangeModalComponent,
    ContactUsModalComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsPageComponent {
  // User data signals
  profileImage = signal('https://via.placeholder.com/150');
  profileLockStatus = signal('public');
  blockedUsersCount = signal(3);
  email = signal('user@example.com');
  name = signal('John Doe');
  username = signal('@johndoe');
  twoFactorStatus = signal(false);

  // Modal visibility signals
  showProfileLockModal = signal(false);
  showBlockingModal = signal(false);
  showEmailModal = signal(false);
  showPasswordModal = signal(false);
  showTwoFactorModal = signal(false);
  showNameModal = signal(false);
  showUsernameModal = signal(false);
  showContactModal = signal(false);

  // Method to open specific modal
  openModal(modalName: string) {
    this.closeAllModals(); // Close any open modals first

    switch (modalName) {
      case 'profileLock':
        this.showProfileLockModal.set(true);
        break;
      case 'blocking':
        this.showBlockingModal.set(true);
        break;
      case 'email':
        this.showEmailModal.set(true);
        break;
      case 'password':
        this.showPasswordModal.set(true);
        break;
      case 'twoFactor':
        this.showTwoFactorModal.set(true);
        break;
      case 'name':
        this.showNameModal.set(true);
        break;
      case 'username':
        this.showUsernameModal.set(true);
        break;
      case 'contact':
        this.showContactModal.set(true);
        break;
    }
  }

  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage.set(e.target?.result as string);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  deleteImage() {
    this.profileImage.set('https://via.placeholder.com/150');
  }

  closeAllModals() {
    this.showProfileLockModal.set(false);
    this.showBlockingModal.set(false);
    this.showEmailModal.set(false);
    this.showPasswordModal.set(false);
    this.showTwoFactorModal.set(false);
    this.showNameModal.set(false);
    this.showUsernameModal.set(false);
    this.showContactModal.set(false);
  }
}
