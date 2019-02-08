import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/*  */
@Injectable() // annotation required for inject one service to another
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {

  }
  /* intercept outgoing request, its like middleware but only for outgoing request */
  intercept(req: HttpRequest<any>, next: HttpHandler) { // next allow us to leave intercept
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      // typical token format: "Bearer somelongtokenstring"
      // set new value for existing header, add new header if it doesn't exist
    }); // clone() create copy of outgoing request
    return next.handle(authRequest); // here simply send out the request without modifying

  }
}
