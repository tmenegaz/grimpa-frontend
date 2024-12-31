import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '~app/config/login/service/auth.service';
import { Tecnico } from '~src/app/components/tecnico/entity/tecnico.model';
import { API_CONFIG, AuthHeaderService } from '~src/app/config/login/service/auth-header.service';
import { TecnicoDto } from '../entity/tecnico.dto';
import { Page } from '../page.interface';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authHeaderService: AuthHeaderService
  ) { }

  findAll(page: number, size: number): Observable<Page<TecnicoDto>> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
      .get<Page<TecnicoDto>>(
        `${API_CONFIG.baseURL}/tecnicos?page=${page}&size=${size}`, { headers }
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

  create(tecnico: Tecnico): Observable<Tecnico> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
      .post<Tecnico>(`${API_CONFIG.baseURL}/tecnicos`, tecnico,
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

  update(id: string, tecnico: Tecnico): Observable<Tecnico> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
      .put<Tecnico>(`${API_CONFIG.baseURL}/tecnicos/${id}`, tecnico,
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

  findById(id: string | number): Observable<Tecnico> {
    const headers = this.authHeaderService.getHeaders();
    return this.http.get<Tecnico>(`${API_CONFIG.baseURL}/tecnicos/${id}`,
      { headers })
      .pipe(catchError((error: HttpErrorResponse): Observable<never> => {
        if (error.status === 403) {
          this.authService.handleTokenExpiration();

        } return throwError(() => error);
      }));
  }

  delete(id: string | number): Observable<Tecnico> {
    const headers = this.authHeaderService.getHeaders();
    return this.http.delete<Tecnico>(`${API_CONFIG.baseURL}/tecnicos/${id}`,
      { headers })
      .pipe(catchError((error: HttpErrorResponse): Observable<never> => {
        if (error.status === 403) {
          this.authService.handleTokenExpiration();

        } return throwError(() => error);
      }));
  }
}
