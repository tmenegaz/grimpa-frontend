import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '~app/config/login/service/auth.service';
import { Cliente } from '~src/app/components/cliente/entity/cliente.model';
import { API_CONFIG, AuthHeaderService } from '~src/app/config/login/service/auth-header.service';
import { ClienteDto } from '../entity/cliente.dto';
import { Page } from '~interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authHeaderService: AuthHeaderService
  ) { }

  findAll(page: number, size: number): Observable<Page<ClienteDto>> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
      .get<Page<ClienteDto>>(
        `${API_CONFIG.baseURL}/clientes?page=${page}&size=${size}`, { headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.authService.handleTokenExpiration();
          }
          return throwError(() => error);
        })
      );
  }

  create(cliente: Cliente): Observable<Cliente> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
      .post<Cliente>(`${API_CONFIG.baseURL}/clientes`, cliente,
        { headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse): Observable<never> => {
          if (error.status === 403) {
            this.authService.handleTokenExpiration();
          }
          return throwError(() => error);
        })
      );
  }

  update(id: string | number, cliente: Cliente): Observable<Cliente> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
      .put<Cliente>(`${API_CONFIG.baseURL}/clientes/${id}`, cliente,
        { headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse): Observable<never> => {
          if (error.status === 403) {
            this.authService.handleTokenExpiration();
          }
          return throwError(() => error);
        })
      );
  }

  findById(id: string | number): Observable<Cliente> {
    const headers = this.authHeaderService.getHeaders();
    return this.http.get<Cliente>(`${API_CONFIG.baseURL}/clientes/${id}`,
      { headers })
      .pipe(catchError((error: HttpErrorResponse): Observable<never> => {
        if (error.status === 403) {
          this.authService.handleTokenExpiration();

        } return throwError(() => error);
      }));
  }

  findByEmail(email: string): Observable<ClienteDto> {
    const headers = this.authHeaderService.getHeaders();

    return this.http.get<ClienteDto>(`${API_CONFIG.baseURL}/clientes/email/${email}`,
      { headers })
      .pipe(catchError((error: HttpErrorResponse): Observable<never> => {
        if (error.status === 403) {
          this.authService.handleTokenExpiration();

        } return throwError(() => error.error.message);
      }));
  }

  delete(id: string | number): Observable<Cliente> {
    const headers = this.authHeaderService.getHeaders();
    return this.http.delete<Cliente>(`${API_CONFIG.baseURL}/clientes/${id}`,
      { headers })
      .pipe(catchError((error: HttpErrorResponse): Observable<never> => {
        if (error.status === 403) {
          this.authService.handleTokenExpiration();

        } return throwError(() => error);
      }));
  }
}
