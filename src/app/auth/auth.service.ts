import { Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser } from './auth-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private authStatus = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  createUser(email: string, password: string) {
    const authData: AuthUser = { email: email, password: password}
    return this.http.post<any>(`${environment.BASE_URL}/api/user/signup`, authData);
  }

  login(email: string, password: string) {
    const authData: AuthUser = { email: email, password: password}
    this.http.post<{token: string}>(`${environment.BASE_URL}/api/user/login`, authData)
    .subscribe(res => {
      if(res?.token) {
        this.token = res.token;
        this.authStatus.next(true);
        this.router.navigate(['/']);
      }
    });
  }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  updateAuthStatus(isAuthenticated: boolean) {
    return this.authStatus.next(isAuthenticated);
  }

  logout() {
    this.token = null;
    this.updateAuthStatus(false);
    this.router.navigate(['/']);
  }
}
