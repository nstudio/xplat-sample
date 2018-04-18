import { Routes, Route } from '@angular/router';

// app
import { AuthGuard } from './services/auth.guard';

export function routesUser(profile: any, extras: Route = {}): Routes {
  return [
    {
      /**
       * Authenticated user profile page
       * Also can be used to view profile pages of other users
       */
      path: ':id',
      component: profile,
      canActivate: [AuthGuard],
      ...extras
    }
  ];
}
