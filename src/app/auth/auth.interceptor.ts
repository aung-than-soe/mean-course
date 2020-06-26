import { AuthService } from './auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        const copy = req.clone({
            setHeaders: {Authorization: `Bearer ${authToken}`}
        });
        return next.handle(copy);
    }
}