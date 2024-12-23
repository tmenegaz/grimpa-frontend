import { provideRouter, Routes, withHashLocation } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';

import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { LoginComponent } from './components/login/login.component';
import { TecnicoListComponent } from './components/tecnico/tecnico-list/tecnico-list.component';
import { authGuard } from './config/login/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: NavComponent, children:
    [
      { path: 'home', component: HomeComponent, canActivate: [authGuard]},
      { path: 'tecnicos', component: TecnicoListComponent },
      { path: 'clientes', component: ClienteListComponent },
    ]
  },
  { path: 'login', component: LoginComponent }
];

export const appConfig = {
  providers:
    [ 
      provideRouter(routes,
      withHashLocation())
    ]
};
