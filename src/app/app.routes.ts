import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, provideRouter, Resolve, RouterStateSnapshot, Routes, withHashLocation } from '@angular/router';
import { finalize, Observable, Subject, takeUntil, tap } from 'rxjs';
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
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TecnicoResolver implements Resolve<any>, OnDestroy {
  private destroy$ = new Subject<void>();

  isLoading = false;

  constructor(
    private tecnicoService: TecnicoService,
    private toastr: ToastrService,
  ) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Tecnico> {
    this.isLoading = true;
    return this.tecnicoService.findById(route.params['id']).pipe(
      takeUntil(this.destroy$),
      tap({
        next: (tecnico) => {
          this.toastr.success(`${tecnico.nome} encontrado`, "Sucesso");
        },
        error: (error) => {
          const erroMessage = error || 'Erro ao consultar técnico';
          error.status === 403
            ? this.toastr.error(erroMessage, "Erro de Autenticação")
            : this.toastr.error(erroMessage, "Erro");
        }
      }),
      finalize(() => this.isLoading = false)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ClienteResolver implements Resolve<any>, OnDestroy {
  private destroy$ = new Subject<void>();

  isLoading = false;

  constructor(
    private clienteService: ClienteService,
    private toastr: ToastrService,
  ) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Cliente> {
    this.isLoading = true;
    return this.clienteService.findById(route.params['id']).pipe(
      takeUntil(this.destroy$),
      tap({
        next: (cliente) => {
          this.toastr.success(`${cliente.nome} encontrado`, "Sucesso");
        },
        error: (error) => {
          const erroMessage = error || 'Erro ao consultar cliente';
          error.status === 403
            ? this.toastr.error(erroMessage, "Erro de Autenticação")
            : this.toastr.error(erroMessage, "Erro");
        }
      }),
      finalize(() => this.isLoading = false)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
