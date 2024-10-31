import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {ToastService} from "../../shared/services/toast.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private _router: Router,
    private authService: AuthenticationService,
    private toastService: ToastService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
          if (err.url?.includes('getCommunity')){

              return throwError(err);
          }
        if ([401, 403].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          // this._router.navigate(['/pages/miscellaneous/not-authorized']);
          this.authService.logout();
          // redirect to login page with return url
          this._router.navigate(['/pages/login-register'], {queryParams: {returnUrl: this._router.url}});
          this.toastService.show('Your session has expired. Please login again.',
            {classname: 'bg-danger text-light', delay: 3000});
        }
        // throwError
        const error = err.error?.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
