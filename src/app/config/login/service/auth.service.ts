import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Credenciais } from '~app/config/login/credenciais';
import { API_CONFIG } from '~src/app/config/login/service/auth-header.service';
import { Perfil } from '~src/app/enums/perfil.enum';

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
      observe: 'response'
    });
  }

  succesFullLogin(authToken: string, perfil?: Perfil): void {
    localStorage.setItem('token', authToken);
    if (perfil) {
      localStorage.setItem('perfil', perfil.toString());
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtService.isTokenExpired(token) : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUserProfile(): Perfil | null {
     const perfil = localStorage.getItem('perfil');
      return perfil ? Perfil[perfil as keyof typeof Perfil] : null;

  }

  handleTokenExpiration(): void { 
    this.toastr.error('A conexão expirou', 'Erro de Autenticação');
    this.router.navigate(['login']);
  }
}
