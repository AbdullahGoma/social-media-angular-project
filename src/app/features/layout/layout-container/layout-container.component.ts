import { Component } from '@angular/core';
import { LeftSidebarComponent } from "../left-sidebar/left-sidebar.component";
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { RightSidebarComponent } from "../right-sidebar/right-sidebar.component";
import { OverlayComponent } from "../overlay/overlay.component";
import { ChatContainerComponent } from "../../../shared/components/chat/chat-container/chat-container.component";
import { ImagePreviewModalComponent } from "../../../shared/components/modals/settings/image-preview-modal/image-preview-modal.component";
import { AddPostModalComponent } from "../../../shared/components/modals/timeline/add-post-modal/add-post-modal.component";
import { PostDetailsModalComponent } from "../../../shared/components/modals/timeline/post-details-modal/post-details-modal.component";
import { TextEditorModalComponent } from "../../../shared/components/modals/timeline/text-editor-modal/text-editor-modal.component";
import { ConfirmationModalComponent } from "../../../shared/components/modals/confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-layout-container',
  standalone: true,
  imports: [RouterOutlet, LeftSidebarComponent, HeaderComponent, RightSidebarComponent, OverlayComponent, ChatContainerComponent, ImagePreviewModalComponent, AddPostModalComponent, PostDetailsModalComponent, TextEditorModalComponent, ConfirmationModalComponent],
  templateUrl: './layout-container.component.html',
  styleUrl: './layout-container.component.css'
})
export class LayoutContainerComponent {

}
