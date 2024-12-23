import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '~entities/login/service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  if (authToken) {
    const clonedReq = req.clone({
    headers: req.headers
    .set('Authorization', `Bearer ${authToken}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
  });
  return next(clonedReq);
  }
  return next(req);
};
