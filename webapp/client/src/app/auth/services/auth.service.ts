import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { catchError, first, take} from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParamsOptions } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorKind, ErrorResponse, LoginSuccessResponse } from '../models/api-responses.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { User } from 'src/app/auth/models/user.model';


@Injectable()
export class AuthService {

  protected readonly apiUrl = '/api/auth';
  protected headers: HttpHeaders = new HttpHeaders();

  constructor(protected http: HttpClient,
              protected router: Router,
              protected localStorageService: LocalStorageService) { 
    
               
    this.headers = this.headers.set('Content-Type', 'application/json')
  }

  public login(email: string, password: string): Promise<LoginSuccessResponse> {
    return firstValueFrom(this.loginRequest(email, password))
    .then((result: LoginSuccessResponse) => {
      // side effects
      this.localStorageService.setItem('user', result.user);
      // this.router.navigate(['/dashboard']);
      return result;
    });
  }

  public logout(message?: string): Promise<any> {
    return firstValueFrom(this.logoutRequest())
    .then((result) => {
      this.localStorageService.removeItem('user');
      this.router.navigate(['/auth/login'], {
        state: {
          ...message && {message}
        }
      });
      return result;
    });
  }

  handleResponseError(error: HttpErrorResponse) {

    // we are only forwarding a simple message to the client
    const logMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    const statusError = `${error.status}: ${error.statusText}`;

    // always have message
    let clientError: ErrorKind = {message: ''};

    if (error.status >= 500) {
      clientError.message = 'A server error occured.';
    }
    else
    if (error.status >= 400) {
      // server received an unxpected request
      clientError.message = error.error.message;
      if (error.error.validationErrors?.length) {
        clientError.validationErrors = error.error.validationErrors;
      }
    }
    else {
      clientError.message = error.error instanceof ErrorEvent ?  
      error.error.message : logMessage;
    }
    
    // logging error:
    return throwError((): ErrorKind => clientError);
  }

  private loginRequest(email: string, password: string): Observable<LoginSuccessResponse> {
    return this.http.post<LoginSuccessResponse>(`${this.apiUrl}/login`, 
        {
          data: {
            email,
            password
          },
        },
        {
          headers: this.headers
        }
      )
      .pipe(
        first(),
        catchError(this.handleResponseError)
      );
  }

  private logoutRequest(): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiUrl}/logout`, 
        {headers: this.headers}
      )
      .pipe(
        first(),
        catchError(this.handleResponseError)
      );
  }

  public isAuthenticated(): boolean {
    return !!this.getUser();
  }

  public getUser(): User | null {
    return this.localStorageService.getItem<User>('user');
  }

  public isAdmin(): boolean {
    return this.getUser()?.isAdmin ?? false;
  }
}
