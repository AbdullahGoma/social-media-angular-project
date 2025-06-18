import { Routes } from '@angular/router';
import { AuthContainerComponent } from './auth-container/auth-container.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TwoFactorComponent } from './two-factor/two-factor.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthContainerComponent,
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'two-factor', component: TwoFactorComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'confirm-email', component: ConfirmEmailComponent },
      { path: 'confirm-password', component: ConfirmPasswordComponent },
    ],
  },
];
