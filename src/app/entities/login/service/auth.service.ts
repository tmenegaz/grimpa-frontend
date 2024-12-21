import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Credenciais } from '../credenciais';
import { API_CONFIG } from '../../../config/api.config';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtService: JwtHelperService = new JwtHelperService();

  constructor(
    private http: HttpClient
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
    return !this.jwtService.isTokenExpired(
      localStorage.getItem('token')
    );
  }
}
