import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Credenciais } from '~entities/login/credenciais';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { API_CONFIG } from '~src/app/config/login/service/auth-header.service';

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
    .post(`${API_CONFIG.baseURL}/login`, creds, {
      observe: 'response',
      responseType: 'text'
    })
  }

  succesFullLogin(authToken: string): void {
    localStorage.setItem('token', authToken);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtService.isTokenExpired(token) : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  handleTokenExpiration(): void { 
    this.toastr.error('A conexão expirou', 'Erro de Autenticação');
    this.router.navigate(['login']);
  }
}
