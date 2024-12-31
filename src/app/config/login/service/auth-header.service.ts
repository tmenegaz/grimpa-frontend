import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthHeaderService {

  constructor(private authService: AuthService) { }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getTokenFromHeader()}` });
  }
}

export const API_CONFIG = {
  baseURL: "http://localhost:8080"
}
