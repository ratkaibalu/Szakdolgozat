import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public email: string = "";
  public password: string = "";
  public invalidLogin: boolean = false;
  public errorMsg: string = "";

  constructor(private authService: AuthService, private router: Router) { }

  login($event: any) {

    $event.preventDefault();

    const validator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    this.invalidLogin = !validator.test(this.email) || !(this.password.length >= 4);

    if (!this.invalidLogin) {
      this.authService.login(this.email, this.password).then((result => this.router.navigate(['/dashboard/teams']))).catch((error) => {
        console.log(error);
        this.errorMsg = error.message;
      });
    }
  }
}
