import { AuthService } from './auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${authToken}`)
        .set('refresh_token', req.headers.has('refresh_token') ? req.headers.get('refresh_token') : '');
        const copy = req.clone({
            headers: headers
        });
        return next.handle(copy);
    }
}