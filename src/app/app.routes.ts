import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, provideRouter, Resolve, RouterStateSnapshot, Routes, withHashLocation } from '@angular/router';
import { Observable } from 'rxjs';
import { ClienteFilterComponent } from './components/cliente/cliente-filter/cliente-filter.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { Tecnico } from './components/tecnico/entity/tecnico.model';
import { TecnicoService } from './components/tecnico/service/tecnico.service';
import { TecnicoFilterComponent } from './components/tecnico/tecnico-filter/tecnico-filter.component';
import { TecnicoFormComponent } from './components/tecnico/tecnico-form/tecnico-form.component';
import { authGuard } from './config/login/auth/auth.guard';
import { ClienteFormComponent } from './components/cliente/cliente-form/cliente-form.component';
import { Cliente } from './components/cliente/entity/cliente.model';
import { ClienteService } from './components/cliente/service/cliente.service';

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

@Injectable({
  providedIn: 'root'
})
export class ClienteResolver implements Resolve<any> {
  constructor(
    private clienteService: ClienteService
  ) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Cliente> {
    return this.clienteService.findById(route.params['id']);
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

        { path: 'clientes', component: ClienteFilterComponent },

        { path: "clientes/criar", component: ClienteFormComponent },

        { path: "clientes/editar/:id", component: ClienteFormComponent, resolve: { cliente: ClienteResolver } },
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
