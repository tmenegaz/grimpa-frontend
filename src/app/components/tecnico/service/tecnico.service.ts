import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '~app/config/login/service/auth.service';
import { Tecnico } from '~src/app/components/tecnico/entity/tecnico';
import { API_CONFIG, AuthHeaderService } from '~src/app/config/login/service/auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {

  
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authHeaderService: AuthHeaderService
  ) {}
  
  findAll(): Observable<Tecnico[]> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
    .get<Tecnico[]>(`${API_CONFIG.baseURL}/tecnicos`, { headers })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.authService.handleTokenExpiration();
        }
        return throwError(() => Error(error.message));
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
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.authService.handleTokenExpiration();
        }
        return throwError(() => Error(error.message));
      })
    );
  }
}
