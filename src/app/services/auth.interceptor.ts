import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
// For build -l -external
// import { ConfigService } from './config.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authService = inject(AuthService);
  // private config = inject(ConfigService);

  // FOR build prod
  private apiUrl = environment.apiUrl;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.startsWith(this.apiUrl)) {
      return this.authService.getToken().pipe(
        switchMap(token => {
          // Clone the request and add the ngrok header first
          let reqWithHeaders = request.clone({
            setHeaders: {
              'ngrok-skip-browser-warning': 'true'
            }
          });

          if (token) {
            reqWithHeaders = reqWithHeaders.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          return next.handle(reqWithHeaders);
        })
      );
    }
    return next.handle(request);
  }
}
