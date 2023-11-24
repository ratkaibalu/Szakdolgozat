import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable, empty } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {
    // this.userSession.currentState.state !== SessionState.valid
    if (!this.authService.isAuthenticated()) {
      //console.log('can not activate - navigating to login');
      return this.router.navigate(['/auth/login']);
      // this.router.navigate(['/dashboard']);
    }
    //console.log('true - can activate');
    return true;
    
    
  }
  
}
