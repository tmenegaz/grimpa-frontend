import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { API_CONFIG, AuthHeaderService } from '~app/config/login/service/auth-header.service';
import { AuthService } from '~app/config/login/service/auth.service';
import { FilePathDto } from '../components/conta/entity/file-path.dto';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authHeaderService: AuthHeaderService
  ) { }

  uploadFile(file: File): Observable<string> {
    const headers = this.authHeaderService.getHeaders();

    const uploadData = new FormData();
    uploadData.append('file', file, file.name);

    return this.http
      .post<string>(`${API_CONFIG.baseURL}/upload`, uploadData,
        {
          headers,
          responseType: 'text' as 'json'
        }
      ).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.authService.handleTokenExpiration();
          }
          return throwError(() => error);
        })
      );
  }

  getFileUrl(fileName: string): Observable<Blob> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
      .get<Blob>(`${API_CONFIG.baseURL}/file/${fileName}`,
        {
          headers,
          responseType: 'blob' as 'json'
        }
      ).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.authService.handleTokenExpiration();
          }
          return throwError(() => error);
        })
      );
  }

  findByPath(fileName: string): Observable<FilePathDto> {
    const headers = this.authHeaderService.getHeaders();

    return this.http
      .get<FilePathDto>(`${API_CONFIG.baseURL}/filePath/${fileName}`,
        {
          headers
        }
      ).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.authService.handleTokenExpiration();
          }
          return throwError(() => error);
        })
      );
  }

  deleteFile(fileName: string): Observable<string> {
    const headers = this.authHeaderService.getHeaders();
    headers.append('Content-Type', 'text/plain');

    return this.http
      .delete<string>(`${API_CONFIG.baseURL}/file/${fileName}`,
        {
          headers
        }
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
}
