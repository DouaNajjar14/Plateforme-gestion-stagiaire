import { Routes } from '@angular/router';
import { guestGuard, authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'departements',
        loadComponent: () => import('./features/departements/departement-list/departement-list.component').then(m => m.DepartementListComponent)
      },
      {
        path: 'agents-rh',
        loadComponent: () => import('./features/agents-rh/agent-rh-list/agent-rh-list.component').then(m => m.AgentRhListComponent)
      },
      {
        path: 'encadrants',
        loadComponent: () => import('./features/encadrants/encadrant-list/encadrant-list.component').then(m => m.EncadrantListComponent)
      },
      {
        path: 'sujets-pfe',
        loadComponent: () => import('./features/sujets-pfe/sujet-pfe-list/sujet-pfe-list.component').then(m => m.SujetPfeListComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
