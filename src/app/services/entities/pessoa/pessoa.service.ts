import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { API_CONFIG, AuthHeaderService } from "~src/app/config/login/service/auth-header.service";
import { PessoaDto } from "./pessoa.dto";
import { AuthService } from "~src/app/config/login/service/auth.service";

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authHeaderService: AuthHeaderService
  ) { }

  findByEmail(email: string): Observable<PessoaDto> {
    const headers = this.authHeaderService.getHeaders();

    return this.http.get<PessoaDto>(`${API_CONFIG.baseURL}/pessoa/email/${email}`,
      { headers })
      .pipe(catchError((error: HttpErrorResponse): Observable<never> => {
        if (error.status === 403) {
          this.authService.handleTokenExpiration();

        } return throwError(() => error.error.message);
      }));
  }
}