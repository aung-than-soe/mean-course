import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authSub: Subscription;
  isAuthenticated: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSub = this.authService.getAuthStatus().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    })
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
