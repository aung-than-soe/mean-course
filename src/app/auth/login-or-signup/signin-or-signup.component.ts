import { AuthService } from './../auth.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-or-signup',
  templateUrl: './signin-or-signup.component.html',
  styleUrls: ['./signin-or-signup.component.scss']
})
export class SignInOrSingUpComponent implements OnInit {

  mode = 'signup';

  constructor(private route: ActivatedRoute, private authService: AuthService) { 
  }

  ngOnInit(): void {
    this.mode = this.route.snapshot.url[0].path;
  }

  onLoginOrSignup(form: NgForm) {
    if(form.invalid) return;
    if(this.mode === 'signup') {
      this.authService.createUser(form.value.email, form.value.password)
      .subscribe(resutl => {
        console.log('resutl ', resutl);
      })
    } else if(this.mode === 'login') {
      this.authService.login(form.value.email, form.value.password);
    }
  }

}
