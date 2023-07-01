import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  emailInputValue: string = '';
  emailHasClickedOut: boolean = false;
  emailIsInputEmpty: boolean = true;

  passwordInputValue: string = '';
  passwordHasClickedOut: boolean = false;
  passwordIsInputEmpty: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {

  }

  onSignupButtonClicked(email: string, password: string) {
    this.authService.signup(email, password).subscribe((res: HttpResponse<any>) => {

      this.router.navigate(['/lists']);
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
