import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  public email: string = "";
  public password: string = "";
  public passwordAgain: string = "";
  public invalidRegister: boolean = false;
  public errorMsg: string = "";

  constructor(private authService: AuthService, private router: Router) { }

  register($event: any) {

    $event.preventDefault();

    const validator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    this.invalidRegister = !validator.test(this.email) || !(this.password.length >= 4);

    if (!this.invalidRegister) {
      // this.authService.register().then((result => this.router.navigate(['/dashboard/teams']))).catch((error) => {
      //   console.log(error);
      //   this.errorMsg = error.message;
      // });
    }
  }
}
