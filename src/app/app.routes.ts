import { ActivatedRouteSnapshot, provideRouter, Resolve, RouterStateSnapshot, Routes, withHashLocation } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { LoginComponent } from './components/login/login.component';
import { TecnicoFilterComponent } from './components/tecnico/tecnico-filter/tecnico-filter.component';
import { authGuard } from './config/login/auth/auth.guard';
import { TecnicoFormComponent } from './components/tecnico/tecnico-form/tecnico-form.component';
import { Injectable } from '@angular/core';
import { TecnicoService } from './components/tecnico/service/tecnico.service';
import { Observable } from 'rxjs';
import { Tecnico } from './components/tecnico/entity/tecnico.model';

@Injectable({
  providedIn: 'root'
})
export class TecnicoResolver implements Resolve<any> {
  constructor(
    private tecnicoService: TecnicoService
  ) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Tecnico> {
    return this.tecnicoService.findById(route.params['id']);
  }
}

export const routes: Routes = [
  {
    path: '', component: NavComponent, children:
      [
        { path: 'home', component: HomeComponent, canActivate: [authGuard] },

        { path: 'tecnicos', component: TecnicoFilterComponent },

        { path: "tecnicos/criar", component: TecnicoFormComponent },

        { path: "tecnicos/editar/:id", component: TecnicoFormComponent, resolve: { tecnico: TecnicoResolver } },

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
