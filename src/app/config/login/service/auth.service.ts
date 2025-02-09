import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { Credenciais } from '~app/config/login/credenciais';
import { API_CONFIG } from '~src/app/config/login/service/auth-header.service';
import { Roles } from '~src/app/enums/roles.enum';
import { PessoaDto } from '~src/app/services/entities/pessoa/pessoa.dto';
import { PessoaService } from '~src/app/services/entities/pessoa/pessoa.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtService = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private readonly router: Router,
  ) { }

  authenticate(creds: Credenciais): Observable<HttpResponse<string>> {
    return this.http
      .post<string>(`${API_CONFIG.baseURL}/login`, creds, {
        observe: 'response',
        withCredentials: true
      });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtService.isTokenExpired(token) : false;
  }

  getTokenFromHeader(): string | null {
    return localStorage.getItem('token');
  }

  getRolesFrom(): string[] | null {
    const roles = localStorage.getItem('roles');
    if (roles) {
      try {
        return JSON.parse(roles);
      } catch (error) {
        console.error('Erro ao analisar os roles do localStorage:', error);
        return null;
      }
    }
    return null;
  }

  getSub(): string {
    const token = this.getTokenFromHeader();
    const decodedToken = this.jwtService.decodeToken(token);
    return decodedToken.sub;
  }

  succesFullLogin(authToken: string): void {
    localStorage.setItem('token', authToken);
    const decodedToken = this.jwtService.decodeToken(authToken);
    if (decodedToken.roles && decodedToken.roles.length > 0) {
      localStorage.setItem('roles', JSON.stringify(decodedToken.roles));
    }
    if (decodedToken.roles.includes('ROLE_SUDO')) {
      (localStorage.setItem('role-toggle-tecnico', JSON.stringify(Roles.ROLE_SUDO)));
      (localStorage.setItem('role-toggle-cliente', JSON.stringify(Roles.ROLE_SUDO)));
      (localStorage.setItem('role-toggle-processo', JSON.stringify(Roles.ROLE_SUDO)));
    }
    if (!decodedToken.roles.includes('ROLE_SUDO')
      && decodedToken.roles.includes('ROLE_ADMIN')) {
      (localStorage.setItem('role-toggle-tecnico', JSON.stringify(Roles.ROLE_ADMIN)));
      (localStorage.setItem('role-toggle-cliente', JSON.stringify(Roles.ROLE_ADMIN)));
      (localStorage.setItem('role-toggle-processo', JSON.stringify(Roles.ROLE_ADMIN)));
    }
    if (!decodedToken.roles.includes('ROLE_SUDO')
      && !decodedToken.roles.includes('ROLE_ADMIN')
      && decodedToken.roles.includes('ROLE_USER')) {
      (localStorage.setItem('role-toggle-tecnico', JSON.stringify(Roles.ROLE_USER)));
      (localStorage.setItem('role-toggle-cliente', JSON.stringify(Roles.ROLE_USER)));
      (localStorage.setItem('role-toggle-processo', JSON.stringify(Roles.ROLE_USER)));
    }
  }

  getCurrentUserRoles(): Roles[] | null {
    const roles = this.getRolesFrom();
    if (roles) {
      return roles.reduce((acc: Roles[], role: string) => {
        switch (role) {
          case 'ROLE_ADMIN':
            acc.push((Roles.ROLE_ADMIN));
            break;
          case 'ROLE_USER':
            acc.push(Roles.ROLE_USER);
            break;
          case 'ROLE_SUDO':
            acc.push(Roles.ROLE_SUDO);
            break;
        }
        return acc;
      }, []);
    }
    return null;
  }

  handleTokenExpiration(): void {
    this.toastr.error('A conexão expirou', 'Erro de Autenticação');
    this.router.navigate(['login']);
  }
}
