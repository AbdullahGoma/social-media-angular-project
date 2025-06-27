import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AuthContainerComponent {}
