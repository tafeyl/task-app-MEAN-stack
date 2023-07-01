import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  emailInputValue: string = '';
  emailHasClickedOut: boolean = false;
  emailIsInputEmpty: boolean = true;

  passwordInputValue: string = '';
  passwordHasClickedOut: boolean = false;
  passwordIsInputEmpty: boolean = true;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

  }

  onLoginButtonClicked(email: string, password: string) {
    this.authService.login(email, password).subscribe({
      next: () => {
        // login was successfull
        this.router.navigate(['/lists']);
      },
      error: (error: any) => {
        // an error occured during the login
        console.error(error);
        this.router.navigate(['/login']);
      }
    });
  }

  onEmailInputBlur(value: string) {
    this.emailHasClickedOut = true;
    this.emailInputValue = value;
    this.emailIsInputEmpty = value.trim() === '';
  }

  onPasswordInputBlur(value: string) {
    this.passwordHasClickedOut = true;
    this.passwordInputValue = value;
    this.passwordIsInputEmpty = value.trim() === '';
  }

  isLoginButtonDisabled(): boolean {
    return this.emailIsInputEmpty || this.passwordIsInputEmpty;
  }
}
