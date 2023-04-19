import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';
import { Registration } from '../models/registration';
import { Router } from '@angular/router';
import { DataService } from '../common/data/data.service';
import { NotificationService } from '../common/notification/notification.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  registrationForm = this.formBuilder.group({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    firstname: new FormControl('', [
      Validators.required,
    ]),
    name: new FormControl('', [
      Validators.required,
    ]),
    postcode: new FormControl('', [
      Validators.required,
    ]),
    city: new FormControl('', [
      Validators.required,
    ]),
    street: new FormControl('', [
      Validators.required,
    ]),
    country: new FormControl('', [
      Validators.required,
    ]),
    mail: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    telephone: new FormControl('', [
      Validators.required,
    ])
  });

  loginForm = this.formBuilder.group({
    username: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
  });

  isUsernameAvailable: boolean | undefined = undefined
  private debounce = 300;


  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private dataService: DataService,
    private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    this.registrationForm.get('username')?.valueChanges.pipe(debounceTime(this.debounce), distinctUntilChanged())
    .subscribe(username => {
      if(!username) {
        return;
      }

      this.onUsernameEntered(username);
    });
  }

  callLogin() {
    let user: User = {
      loginName: this.loginForm.controls["username"].value,
      passwort: { 
        passwort: this.loginForm.controls["password"].value 
      },
    };

    this.authenticationService.login(user).subscribe((response) => {
      if (!response.sessionID) {
        this.notificationService.error("Login failed!");
        return;
      }

      
      user.session = response.sessionID;
      this.dataService.user = user;

      this.notificationService.success("Login successful!");
      this.router.navigateByUrl('/');
    },
    (error) => {
      this.notificationService.error("Login failed!");
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
        this.notificationService.error(response.meldung);
        return;
      }

      this.notificationService.success("Registration successful!");
    },
    (error) => {
      this.notificationService.error("Registration failed!");
    });
  }

  onUsernameEntered(username: string) {
    this.authenticationService.checkUsername(username).subscribe((response) => {
      this.isUsernameAvailable = response.ergebnis;
      
    })
  }
}
