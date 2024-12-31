import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { Credenciais } from '~app/config/login/credenciais';
import { API_CONFIG } from '~src/app/config/login/service/auth-header.service';
import { Roles } from '~src/app/enums/roles.enum';

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

  succesFullLogin(authToken: string): void {
    localStorage.setItem('token', authToken);
    const decodedToken = this.jwtService.decodeToken(authToken);
    if (decodedToken.roles && decodedToken.roles.length > 0) {
      localStorage.setItem('roles', JSON.stringify(decodedToken.roles));
    }

    decodedToken.roles.includes(Roles.ADMIN)
      ? localStorage.setItem('role-toggle', JSON.stringify(Roles.ADMIN))
      : localStorage.setItem('role-toggle', JSON.stringify(Roles.USER))

  }

  getCurrentUserRoles(): Roles[] | null {
    const roles = this.getRolesFrom();
    if (roles) {
      return roles.reduce((acc: Roles[], role: string) => {
        switch (role) {
          case 'ROLE_ADMIN':
            acc.push(Roles.ADMIN);
            break;
          case 'ROLE_USER':
            acc.push(Roles.USER);
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
