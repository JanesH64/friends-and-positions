import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';
import { Registration } from '../models/registration';
import { Router } from '@angular/router';
import { DataService } from '../common/data/data.service';
import { NotificationService } from '../common/notification/notification.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  registrationForm = this.formBuilder.group({
    username: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
    ]),
    firstname: new FormControl('', [
      Validators.required,
    ]),
    name: new FormControl('', [
      Validators.required,
    ]),
    postalcode: new FormControl('', [
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
    ]),
    recaptcha: new FormControl('', [
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
    recaptcha: new FormControl('', [
      Validators.required,
    ]),
  });

  isUsernameAvailable: boolean | undefined = undefined;

  authenticationInProgress = false;
  siteKey = environment.recaptcha.siteKey;

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
        if (!username) {
          return;
        }

        this.onUsernameEntered(username);
      });

    this.registrationForm.get('postalcode')?.valueChanges.pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(postalCode => {
        if (!postalCode) {
          return;
        }

        this.onPostalCodeEntered(postalCode);
      });

    this.registrationForm.get('password')?.valueChanges
      .subscribe(() => {
        this.onPasswordChanged();
      });

    this.registrationForm.get('confirmPassword')?.valueChanges
      .subscribe(() => {
        this.onPasswordChanged();
      });
  }

  callLogin() {
    this.authenticationInProgress = true;

    let user: User = {
      loginName: this.loginForm.controls["username"].value,
      passwort: {
        passwort: this.loginForm.controls["password"].value
      },
    };

    this.authenticationService.login(user).subscribe(
      {
        next: (response) => {
          if (!response.sessionID) {
            setTimeout(() => {
              this.authenticationInProgress = false;
              this.notificationService.error("Login failed!");
            }, 1500);
            return;
          }


          user.session = response.sessionID;
          this.dataService.user = user;
          this.setLocalStorage();

          setTimeout(() => {
            this.authenticationInProgress = false;
            this.notificationService.success("Login successful!");
            this.router.navigateByUrl('/');
          }, 1500);
        },
        error: (error) => {
          setTimeout(() => {
            this.authenticationInProgress = false;
            this.notificationService.error("Login failed!");
          }, 1500);
        }
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
      plz: this.registrationForm.controls["postalcode"].value,
      ort: this.registrationForm.controls["city"].value,
      land: this.registrationForm.controls["country"].value,
      telefon: this.registrationForm.controls["telephone"].value,
      email: {
        adresse: this.registrationForm.controls["mail"].value
      }
    };

    this.authenticationInProgress = true;

    this.authenticationService.addUser(user).subscribe({
      next: (response) => {
        if (!response.ergebnis) {
          this.notificationService.error(response.meldung);
          return;
        }

        setTimeout(() => {
          this.authenticationInProgress = false;
          this.notificationService.success("Registration successful!");
        }, 1500);
      },
      error: (error) => {
        setTimeout(() => {
          this.authenticationInProgress = false;
          this.notificationService.error("Registration failed!");
        }, 1500);
      }
    })
  }

  onUsernameEntered(username: string) {
    this.authenticationService.checkUsername(username).subscribe((response) => {
      this.isUsernameAvailable = response.ergebnis;
      if (!this.isUsernameAvailable) {
        this.registrationForm.get('username')?.setErrors({
          unavailable: true
        });
      }
    })
  }

  onPostalCodeEntered(postalcode: string) {
    this.authenticationService.getCityFromPostalCode(postalcode.trim()).subscribe((response) => {
      if (response?.postalCodes.length > 0) {
        this.registrationForm.controls["city"].setValue(response.postalCodes[0].placeName);
      }
    })
  }

  onPasswordChanged() {
    let confirmPasswordControl = this.registrationForm.get('confirmPassword');
    let passwordControl = this.registrationForm.get('password');

    if ((!passwordControl || passwordControl.value === "") || (!confirmPasswordControl || confirmPasswordControl.value === "")) {
      passwordControl?.setErrors(null);
      confirmPasswordControl?.setErrors(null);
      return;
    }

    if (passwordControl?.value === confirmPasswordControl?.value) {
      passwordControl?.setErrors(null);
      confirmPasswordControl?.setErrors(null);
      return;
    }

    console.log("not equal")

    passwordControl?.setErrors({
      notEqual: true
    });

    confirmPasswordControl?.setErrors({
      notEqual: true
    });
  }

  setLocalStorage() {
    localStorage.setItem("fap_currentuser", `${this.dataService.user?.loginName}`);
    localStorage.setItem("fap_authsessionid", `${this.dataService.user?.session}`);
  }
}
