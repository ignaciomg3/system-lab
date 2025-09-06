import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NewRequest } from './pages/new-request/new-request';
import { EditRequest } from './pages/edit-request/edit-request';
import { PullRequest } from './pages/pull-request/pull-request';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // ← Ruta por defecto
  { path: 'home', component: Home },
  { path: 'new-request', component: NewRequest },
  { path: 'edit-request', component: EditRequest },
  { path: 'pull-request', component: PullRequest },
];
