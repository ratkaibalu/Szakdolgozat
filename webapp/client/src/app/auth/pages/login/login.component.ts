import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public email: string = "";
  public password: string = "";
  public errorMsg: string = "";

  constructor(private authService: AuthService, private router: Router) { }

  login($event: any) {
    $event.preventDefault();

    this.authService.login(this.email, this.password).then((result => this.router.navigate(['/dashboard/teams']))).catch((error) => {
      // console.log(error);
      this.errorMsg = error.message;
    });
  }
}
