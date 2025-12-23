import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NewRequest } from './pages/new-request/new-request';
import { EditRequest } from './pages/edit-request/edit-request';
import { PullRequest } from './pages/pull-request/pull-request';
import { RegistroIngresos } from './pages/registro-ingresos/registro-ingresos';
import { SolicitudAnalisis } from './pages/solicitud-analisis/solicitud-analisis';
import { Sistema } from './pages/sistema/sistema';
import { Elementos } from './pages/elementos/elementos';
import { Parametros } from './pages/parametros/parametros';
import { Plantillas } from './pages/plantillas/plantillas';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // ← Ruta por defecto
  { path: 'home', component: Home },
  { path: 'new-request', component: NewRequest },
  { path: 'edit-request', component: EditRequest },
  { path: 'pull-request', component: PullRequest },
  { path: 'registro-ingresos', component: RegistroIngresos },
  { path: 'solicitud-analisis', component: SolicitudAnalisis },
  { path: 'sistema', component: Sistema },
  { path: 'elementos', component: Elementos },
  { path: 'parametros', component: Parametros },
  { path: 'sistema/plantillas', component: Plantillas },
];
