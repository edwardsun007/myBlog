import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


/*  */
// annotation required for inject one service to another
export class ErrorInterceptor implements HttpInterceptor {

  /* itercept outgoing request, its like middleware but only for outgoing request */
  intercept(req: HttpRequest<any>, next: HttpHandler) { // next allow us to leave intercept
    return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          alert(error.error.message); // error property in json
          return throwError(error); // create new observable, here we simply pass the same error obs from catchError
        })
    ); // here simply send out the request without modifying

  }
}
