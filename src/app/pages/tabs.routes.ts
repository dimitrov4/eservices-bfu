import { Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { SettingsGuard } from '../guards/settings.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'lectures',
        canActivate: [SettingsGuard],
        loadComponent: () => import('./lectures/lectures.page').then((m) => m.LecturesPage),
      },
      {
        path: 'exams',
        canActivate: [SettingsGuard],
        loadComponent: () => import('./exams/./exams.page').then((m) => m.ExamsPage),
      },
      {
        path: 'marks',
        canActivate: [SettingsGuard],
        loadComponent: () => import('./marks/marks.page').then((m) => m.MarksPage),
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/lectures',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/lectures',
    pathMatch: 'full',
  }
];
