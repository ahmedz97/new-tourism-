import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../../pages/login/login.component').then((m) => m.LoginComponent),
    title: 'Log In',
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../../pages/signup/signup.component').then((m) => m.SignupComponent),
    title: 'Sign Up',
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('../../pages/forget-password/forget-password.component').then(
        (m) => m.ForgetPasswordComponent
      ),
    title: 'Forget Password',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

