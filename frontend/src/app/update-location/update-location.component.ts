import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';
import { DataService } from '../common/data/data.service';

@Component({
  selector: 'app-update-location',
  templateUrl: './update-location.component.html',
  styleUrls: ['./update-location.component.scss']
})
export class UpdateLocationComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private dataService: DataService,
    private formBuilder: FormBuilder) {}

  isUserAuthenticated(): boolean {
    return this.dataService.user?.sitzung !== undefined;
  }

  logout() {
    this.authenticationService.logout();
  }

  


  updateLocationForm = this.formBuilder.group({
    username: new FormControl('', [
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
  });

  ngOnInit(): void {
    console.log("load Update Location")

    let sitzung = this.dataService.user?.sitzung;
    let username = this.dataService.user?.loginName;

    if (username) {
      const usernameControl = this.updateLocationForm.get('username')?.setValue(username);
    }

    // load current location of the user
  }

  updateLocation() {
    console.log("Update Location")

    // update the location of the user
    


    /*
    let user: Registration = {
      loginName: this.updateLocationForm.controls["username"].value,
      
      strasse: this.updateLocationForm.controls["street"].value,
      plz: this.updateLocationForm.controls["postalcode"].value,
      ort: this.updateLocationForm.controls["city"].value,
      land: this.updateLocationForm.controls["country"].value,

    };
    */

/*
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
    */
  }
}
