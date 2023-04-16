import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent {

  constructor(private formBuilder: FormBuilder) {

  }

  registrationForm = this.formBuilder.group({
    username: '',
    password: '',
    firstname: '',
    name: '',
    postalcode: '',
    city: '',
    street: '',
    country: '',
    mail: ''
  });

  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  callLogin() {}
  callRegister() {}
  

}
