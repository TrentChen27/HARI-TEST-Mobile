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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Only intercept requests to our own API
    if (request.url.startsWith(this.apiUrl)) {

      // Use switchMap to get the token asynchronously
      return this.authService.getToken().pipe(
        switchMap(token => {
          if (token) {
            // If we have a token, clone the request and add the auth header
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          // Send the new (or original) request
          return next.handle(request);
        })
      );
    }

    // For all other requests (e.g., to other domains), let them pass
    return next.handle(request);
  }
}
