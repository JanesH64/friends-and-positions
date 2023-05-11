import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { DataService } from '../common/data/data.service';
import { UpdateLocationService } from './update-location.service';
import * as Leaflet from 'leaflet';
import { NotificationService } from '../common/notification/notification.service';
import { User } from '../models/user';

@Component({
  selector: 'app-update-location',
  templateUrl: './update-location.component.html',
  styleUrls: ['./update-location.component.scss']
})
export class UpdateLocationComponent implements OnInit {

  private debounce = 300;

  updateLocationMap: any;
  updateLocationMarkers: Leaflet.Marker[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private updateLocationService: UpdateLocationService,
    private dataService: DataService,
    private formBuilder: FormBuilder) { }

  isUserAuthenticated(): boolean {
    return this.dataService.user?.sitzung !== undefined;
  }

  logout() {
    this.authenticationService.logout();
  }

  // create form to update the location
  updateLocationForm = this.formBuilder.group({
    username: new FormControl({ value: '', disabled: true }, [
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

    this.initializeFormControl();

    // listen for input for the postal code 
    this.updateLocationForm.get('postalcode')?.valueChanges.pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(postalCode => {
        if (!postalCode) {
          // empty the city when the plz was removed
          this.updateLocationForm.controls["city"].setValue("");
          return;
        }

        // determine the city for the zip code if it is a german postal code
        const germanPostalCodePattern = /^[0-9]{5}$/;
        //if (germanPostalCodePattern.test(postalCode)) {
          this.onPostalCodeEntered(postalCode);
        //}
      });

    // get the current location of the user
    this.updateLocationService.getLocation().subscribe((response : any) => {

      if (response?.ergebnis == false) { 
        console.log("Test")
        // If no location is stored load the current location of the user from the geodata of the browser
        if ("geolocation" in navigator) {
          console.log("Test1")
          navigator.geolocation.getCurrentPosition((position) => {
            let username = this.dataService.user?.loginName;
            if( username ){
              this.initializeMap(position.coords.latitude, position.coords.longitude);
              this.updateMarkerOnMap( position.coords.latitude,position.coords.longitude, username);
            } else {
              this.initializeMap(position.coords.latitude, position.coords.longitude);
            }
          
            console.log("Latitude: " + position.coords.latitude);
            console.log("Longitude: " + position.coords.longitude);
            return;
          });
        } else {
          // set default location to address of WHS Bocholt
          this.initializeMap(51.83976517573082, 6.651767759445426);
          console.log("Geolocation is not supported by this browser.");
          return;
        }

      } else if (response.standort.breitengrad && response.standort.laengengrad && this.dataService.user?.loginName) {
        // set the current location of the user on the map
        let latitude = response.standort.breitengrad;
        let longitude = response.standort.laengengrad;
        this.initializeMap(latitude, longitude);
        this.updateMarkerOnMap(latitude, longitude, this.dataService.user?.loginName);
      } else {
        // set default location to address of WHS Bocholt
        this.initializeMap(51.83976517573082, 6.651767759445426);
        return;
      }
    });
  }

  

  onPostalCodeEntered(postalcode: string) {
    this.updateLocationService.getCityFromPostalCode(postalcode.trim()).subscribe((response) => {
      if (response?.ergebnis === false) {
        this.updateLocationForm.controls["city"].setValue("");
        this.showErroMessage("No City found for Postalcode!");
      } else {
        this.updateLocationForm.controls["city"].setValue(response.name);
      }
    })
  }

  initializeMap(latitude: number, longitude: number) {
    // initialize the map
    let map = Leaflet.map('updateLocationMap').setView([longitude, latitude], 16);
    this.updateLocationMap = map;
    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    Leaflet.Icon.Default.imagePath = "assets/leaflet/"
  }

  updateMarkerOnMap(pLat: number, pLon: number, name: string) {
    // update the marker on the map
    this.updateLocationMap.remove();
    this.updateLocationMarkers = [];

    let marker = Leaflet.marker({ lat: pLat, lng: pLon }).bindPopup(name);
    this.updateLocationMarkers.push(marker);

    let layerGroup = new Leaflet.LayerGroup(this.updateLocationMarkers);

    let map = Leaflet.map('updateLocationMap').setView([pLat, pLon], 16);
    this.updateLocationMap = map;
    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    layerGroup.addTo(this.updateLocationMap);
  }



  updateLocation() {
    console.log("Update Location")

    // get the specified location information
    let country = this.updateLocationForm.controls["country"].value
    let postalcode = this.updateLocationForm.controls["postalcode"].value
    let city = this.updateLocationForm.controls["city"].value
    let street = this.updateLocationForm.controls["street"].value

    if (country != null && postalcode != null && city != null && street != null) {
      // get the address from the location information
      this.updateLocationService.getLocationByAddress(country, postalcode.trim(), city, street).subscribe((response) => {
        if (response?.ergebnis === false) {
          this.showErroMessage("The geo-information could not be determined from the supplied data!");
        } else if (response.breitengrad != null && response.laengengrad != null) {
          let latitude = response.breitengrad;
          let longitude = response.laengengrad;
          // update the location of the user
          this.updateLocationService.updateLocation(latitude, longitude).subscribe((response) => {
            if (response?.ergebnis === false) {
              this.showErroMessage("Your location could not be updated!");
            } else {
              let username = this.dataService.user?.loginName;

              if (username) {
                // update the location on the map and reset the form
                this.updateMarkerOnMap(latitude, longitude, username);
                this.initializeFormControl();
                this.showSuccessMessage("Your location has been updated!");
              } else{
                this.showErroMessage("Your location could not be shwown because your user session is not available!");
              }
            }
          });
        } else {
          this.showErroMessage("Your location could not be determined by the service!");
        }
      });
    } else {
      this.showErroMessage("The new location was not fully specified. Please check the form!");
    }

  }

  private initializeFormControl() {
    this.updateLocationForm.reset();
    if (!this.dataService.user?.loginName) return;
    // set the user name
    this.updateLocationForm.get("username")?.setValue(this.dataService.user?.loginName);
  }

  private showErroMessage(text: string) {
    setTimeout(() => {
      this.notificationService.error(text);
    }, 1500);
  }

  private showSuccessMessage(text: string) {
    setTimeout(() => {
      this.notificationService.success(text);
    }, 1500);
  }
}

