import { Component } from '@angular/core';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [],
  templateUrl: './two-factor.component.html',
  styleUrl: './two-factor.component.css',
})
export class TwoFactorComponent {
  // const inputs = document.querySelectorAll(".otp-input");
  // inputs.forEach((input, i) => {
  //   input.addEventListener("input", () => {
  //     if (input.value.match(/^\d$/) && i < inputs.length - 1) {
  //       inputs[i + 1].focus();
  //     }
  //   });
  //   input.addEventListener("keydown", (e) => {
  //     if (e.key === "Backspace" && !input.value && i > 0) {
  //       inputs[i - 1].focus();
  //     }
  //   });
  // });
}
