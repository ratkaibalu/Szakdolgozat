import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    // const userState = this.userSessionService.currentState.state;
    // const cloned = req.clone();
    return next.handle(req)
      .pipe(
        catchError((error: any, caught: Observable<HttpEvent<any>>) => {
          if (this.isUnAuthorized(error)) {
              // redirect to logout
              this.authService.logout('Your session has expired. Please login again.');
          }
          return throwError(() => error);
        })
      );
  }

  protected isUnAuthorized(error: any): boolean {
    return error instanceof HttpErrorResponse && error.status === 401;
  }
}
