import { HttpHandler, HttpRequest, HttpClient, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ToastController } from '@ionic/angular';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorProvider implements HttpInterceptor {

  constructor(
    public http: HttpClient,
    public toastController: ToastController,
    private authService: AuthService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
      
    return from(this.authService.getToken()).pipe(mergeMap((token) => {
      
      const changedReq = request.clone({
          setHeaders: {
              Authorization: `Bearer ${token}`
          }
      });

      return next.handle(changedReq);
  }));
}
  }
