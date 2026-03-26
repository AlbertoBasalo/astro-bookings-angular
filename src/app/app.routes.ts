import { Routes } from '@angular/router';

import { featureRoutePaths } from './app.navigation';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },
  {
    path: featureRoutePaths.rockets,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/rockets/rockets-page/rockets-page').then((m) => m.RocketsPage),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/rockets/rocket-form-page/rocket-form-page').then((m) => m.RocketFormPage),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./features/rockets/rocket-form-page/rocket-form-page').then((m) => m.RocketFormPage),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/rockets/rocket-detail-page/rocket-detail-page').then(
            (m) => m.RocketDetailPage,
          ),
      },
    ],
  },
  {
    path: featureRoutePaths.launches,
    loadComponent: () =>
      import('./features/launches/launches-page/launches-page').then((m) => m.LaunchesPage),
  },
  {
    path: featureRoutePaths.customers,
    loadComponent: () =>
      import('./features/customers/customers-page/customers-page').then((m) => m.CustomersPage),
  },
  {
    path: featureRoutePaths.bookings,
    loadComponent: () =>
      import('./features/bookings/bookings-page/bookings-page').then((m) => m.BookingsPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
