import { Routes } from '@angular/router';

export const dataRoutes: Routes = [
  {
    path: 'blog',
    loadComponent: () =>
      import('../../pages/blog/blog.component').then((m) => m.BlogComponent),
    title: 'Blogs',
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('../../pages/blog-details/blog-details.component').then(
        (m) => m.BlogDetailsComponent
      ),
    title: 'Blog Details',
  },
  {
    path: 'tour',
    loadComponent: () =>
      import('../../pages/tour/tour.component').then((m) => m.TourComponent),
    title: 'Tours',
  },
  {
    path: 'tour/:slug',
    loadComponent: () =>
      import('../../pages/tour-details/tour-details.component').then(
        (m) => m.TourDetailsComponent
      ),
    title: 'Tour Details',
  },
  {
    path: 'destination',
    loadComponent: () =>
      import('../../pages/destination/destination.component').then(
        (m) => m.DestinationComponent
      ),
    title: 'Destinations',
  },
  {
    path: 'destination/:slug',
    loadComponent: () =>
      import('../../pages/destination-details/destination-details.component').then(
        (m) => m.DestinationDetailsComponent
      ),
    title: 'Destinations Details',
  },
  {
    path: '',
    redirectTo: 'blog',
    pathMatch: 'full',
  },
];

