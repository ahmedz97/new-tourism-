import { Routes } from '@angular/router';
import { authRoutes } from './modules/auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
    title: 'About',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
    title: 'Contact',
  },
  {
    path: 'terms-and-conditions',
    loadComponent: () =>
      import('./pages/terms-condition/terms-condition.component').then(
        (m) => m.TermsConditionComponent
      ),
    title: 'Terms & Conditions',
  },
  // Data Module Routes (Blog, Tour, Destination) - Direct routes without 'data' prefix
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog/blog.component').then((m) => m.BlogComponent),
    title: 'Blogs',
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./pages/blog-details/blog-details.component').then(
        (m) => m.BlogDetailsComponent
      ),
    title: 'Blog Details',
  },
  {
    path: 'tour',
    loadComponent: () =>
      import('./pages/tour/tour.component').then((m) => m.TourComponent),
    title: 'Tours',
  },
  {
    path: 'tour/:slug',
    loadComponent: () =>
      import('./pages/tour-details/tour-details.component').then(
        (m) => m.TourDetailsComponent
      ),
    title: 'Tour Details',
  },
  {
    path: 'packages',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/tour-packages/tour-packages.component').then(
        (m) => m.TourPackagesComponent
      ),
    title: 'Tour Packages',
  },
  {
    path: 'nile_Cruises',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/nile-cruises/nile-cruises.component').then(
        (m) => m.NileCruisesComponent
      ),
    title: 'Nile Cruises',
  },
  {
    path: 'destination',
    loadComponent: () =>
      import('./pages/destination/destination.component').then(
        (m) => m.DestinationComponent
      ),
    title: 'Destinations',
  },
  {
    path: 'destination/:slug',
    loadComponent: () =>
      import('./pages/destination-details/destination-details.component').then(
        (m) => m.DestinationDetailsComponent
      ),
    title: 'Destinations Details',
  },
  // Auth Module Routes (Login, Signup, Forget Password)
  {
    path: 'auth',
    children: authRoutes,
  },
  // Legacy routes for backward compatibility - Auth
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'signup',
    redirectTo: 'auth/signup',
    pathMatch: 'full',
  },
  {
    path: 'forgetPassword',
    redirectTo: 'auth/forget-password',
    pathMatch: 'full',
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
    title: 'Checkout',
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
    title: 'Cart',
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./pages/faq/faq.component').then((m) => m.FaqComponent),
    title: 'FAQs',
  },
  {
    path: 'makeTrip',
    loadComponent: () =>
      import('./pages/make-trip/make-trip.component').then(
        (m) => m.MakeTripComponent
      ),
    title: 'Make Your Trip',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    title: 'My Account',
  },

  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: 'Page Not Found',
  },
];
