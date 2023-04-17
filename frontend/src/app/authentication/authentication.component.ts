import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';
import { Registration } from '../models/registration';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent {

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService) {
  }

  registrationForm = this.formBuilder.group({
    username: '',
    password: '',
    firstname: '',
    name: '',
    postcode: '',
    city: '',
    street: '',
    country: '',
    mail: '',
    telephone: ''
  });

  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  callLogin() {
    let user: User = {
      loginName: this.loginForm.controls["username"].value,
      passwort: { 
        passwort: this.loginForm.controls["password"].value 
      },
    };

    this.authenticationService.login(user).subscribe((response) => {
      if (!response.sessionID) {
        console.error("Login failed!");
        return;
      }

      console.log("Success");
    });
  }
  callRegister() {
    let user: Registration = {
      loginName: this.registrationForm.controls["username"].value,
      passwort: {
        passwort: this.registrationForm.controls["password"].value,
      },
      vorname: this.registrationForm.controls["firstname"].value,
      nachname: this.registrationForm.controls["name"].value,
      strasse: this.registrationForm.controls["street"].value,
      plz: this.registrationForm.controls["postcode"].value,
      ort: this.registrationForm.controls["city"].value,
      land: this.registrationForm.controls["country"].value,
      telefon: this.registrationForm.controls["telephone"].value,
      email: {
        adresse: this.registrationForm.controls["mail"].value
      }
    };

    this.authenticationService.addUser(user).subscribe((response) => {
      if (!response.ergebnis) {
        console.error(response.meldung);
        return;
      }

      console.log("Success");
    });
  }


}
