import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '~app/config/login/service/auth.service';
import { Page } from '~interfaces/page.interface';
import { Processo } from '~src/app/components/processo/entity/processo.model';
import { API_CONFIG, AuthHeaderService } from '~src/app/config/login/service/auth-header.service';
import { ProcessoDto } from '../entity/processo.dto';

@Injectable({
  providedIn: 'root'
})
export class ProcessoService {


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authHeaderService: AuthHeaderService
  ) { }

  findAll(page: number, size: number): Observable<Page<ProcessoDto>> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
      .get<Page<ProcessoDto>>(
        `${API_CONFIG.baseURL}/processos?page=${page}&size=${size}`, { headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.authService.handleTokenExpiration();
          }
          return throwError(() => error.error.message);
        })
      );
  }

  create(tecnico: Processo): Observable<Processo> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
      .post<Processo>(`${API_CONFIG.baseURL}/processos`, tecnico,
        { headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse): Observable<never> => {
          if (error.status === 403) {
            this.authService.handleTokenExpiration();
          }
          return throwError(() => error.error.message);
        })
      );
  }

  update(id: string, tecnico: ProcessoDto): Observable<Processo> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
      .put<Processo>(`${API_CONFIG.baseURL}/processos/${id}`, tecnico,
        { headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse): Observable<never> => {
          if (error.status === 403) {
            this.authService.handleTokenExpiration();
          }
          return throwError(() => error.error.message);
        })
      );
  }

  findById(id: string): Observable<Processo> {
    const headers = this.authHeaderService.getHeaders();
    return this.http.get<Processo>(`${API_CONFIG.baseURL}/processos/${id}`,
      { headers })
      .pipe(catchError((error: HttpErrorResponse): Observable<never> => {
        if (error.status === 403) {
          this.authService.handleTokenExpiration();

        } return throwError(() => error.error.message);
      }));
  }


  delete(id: string): Observable<Processo> {
    const headers = this.authHeaderService.getHeaders();
    return this.http.delete<Processo>(`${API_CONFIG.baseURL}/processos/${id}`,
      { headers })
      .pipe(catchError((error: HttpErrorResponse): Observable<never> => {
        if (error.status === 403) {
          this.authService.handleTokenExpiration();

        } return throwError(() => error.error.message);
      }));
  }
}
