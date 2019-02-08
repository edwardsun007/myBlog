import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/* this class serve as guard against unauthenticated attemp to access certain routes by typing it in url
for example: https://localhost:3000/api/posts/delete/:id...,  create user, signup route all need to be guarded
*/
@Injectable()

export class AuthGuard implements CanActivate {

  constructor(private _auth: AuthService, private router: Router) {}
  // arguments: the route you trying to load,
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = this._auth.getAuthStatus();
    if (!isAuth) {
        // unauthenticated access, navigate away to login page
        this.router.navigate(['/login']);
    }
    return isAuth;
  }
}
