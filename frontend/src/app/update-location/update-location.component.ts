import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { DataService } from '../common/data/data.service';
import { UpdateLocationService } from './update-location.service';
import * as Leaflet from 'leaflet';
import { NotificationService } from '../common/notification/notification.service';

@Component({
  selector: 'app-update-location',
  templateUrl: './update-location.component.html',
  styleUrls: ['./update-location.component.scss']
})
export class UpdateLocationComponent implements OnInit {

  private debounce = 300;


  map: any;

  markers:  Leaflet.Marker[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private updateLocationService: UpdateLocationService,
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

    let username = this.dataService.user?.loginName;

    if (username) {
      this.updateLocationForm.controls["username"].setValue(username);
    }

    let map = Leaflet.map('map').setView([51.8392323, 6.6512868], 10);
    this.map = map;
    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    Leaflet.Icon.Default.imagePath = "assets/leaflet/"



    //this.requestLocationService.setLocation("hansi",52.0255391,6.8305445).subscribe();

    
    this.updateLocationForm.get('postalcode')?.valueChanges.pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(postalCode => {
        if (!postalCode) {
          this.updateLocationForm.controls["city"].setValue("");
          return;
        }
        const germanPostalCodePattern = /^[0-9]{5}$/;

        if (germanPostalCodePattern.test(postalCode)){
          this.onPostalCodeEntered(postalCode);
        }
      });

    
      this.updateLocationService.getLocation().subscribe((response) => {
        if ( response.ergebnis != undefined && response.ergebnis == false  && response.breitengrad && response.laengengrad && username){
          let latitude  = response.breitengrad;
          let longitude  = response.laengengrad;
          this.updateMarkerOnMap(latitude, longitude, username);
        }
      });
  }

  onPostalCodeEntered(postalcode: string) {
    // TODO - springt hier immer rein, dadurch kommt die Fehlermeldung hoch, sollte erst wenn Eingabe fertig ist
    this.updateLocationService.getCityFromPostalCode(postalcode.trim()).subscribe((response) => {
        if ( response.ergebnis != undefined && response.ergebnis == false ){
          this.updateLocationForm.controls["city"].setValue("");
          setTimeout(() => {
            this.notificationService.error("No City found for Postalcode!");
          }, 1500);
        } else {
          this.updateLocationForm.controls["city"].setValue(response.name);
        }
    })
  }

  updateMarkerOnMap(pLat: number, pLon: number, name: string){
    this.map.remove();
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });

    let marker = Leaflet.marker({lat: pLat, lng: pLon}).bindPopup(name);
    this.markers.push(marker);

    let layerGroup = new Leaflet.LayerGroup(this.markers);

    let map = Leaflet.map('map').setView([pLat, pLon], 10);
    this.map = map;
    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    layerGroup.addTo(this.map);
    this.markers.push(marker);
  }



  updateLocation() {
    console.log("Update Location")
    let country = this.updateLocationForm.controls["country"].value
    let postalcode = this.updateLocationForm.controls["postalcode"].value
    let city = this.updateLocationForm.controls["city"].value
    let street = this.updateLocationForm.controls["street"].value

    if (country != null && postalcode != null  && city != null && street != null ){
      this.updateLocationService.getLocationByAddress(country, postalcode.trim(), city, street ).subscribe((response) => {
        if ( response.ergebnis != undefined && response.ergebnis == false ){
          this.updateLocationForm.controls["city"].setValue("");
          setTimeout(() => {
            this.notificationService.error("No City found for Postalcode!");
          }, 1500);
        } else if ( response.breitengrad != null && response.laengengrad != null){
          let latitude = response.breitengrad;
          let longitude = response.laengengrad;
          this.updateLocationService.updateLocation(latitude, longitude ).subscribe((response) => {
            // TODO bearbeiten der Response
            if ( response.ergebnis != undefined && response.ergebnis == false ){
              setTimeout(() => {
                this.notificationService.error("Your location could not be updated!");
              }, 1500);
            } else{
              let username = this.dataService.user?.loginName;
              
              if ( response.ergebnis != undefined && !response.ergebnis && username ){
                
                this.updateMarkerOnMap(latitude, longitude, username);
              
                this.updateLocationForm.controls["postalcode"].setValue("");
                this.updateLocationForm.controls["city"].setValue("");
                this.updateLocationForm.controls["street"].setValue("");
                this.updateLocationForm.controls["country"].setValue("");
                
                setTimeout(() => {
                  this.notificationService.success("Your location has been updated!");
                }, 1500);
              }
            }
          });
        } else {
          setTimeout(() => {
            this.notificationService.error("Your location could not be determined by the service!");
          }, 1500);
        }
      });
    } else{
      setTimeout(() => {
        this.notificationService.error("The new location was not fully specified. Please check the form!");
      }, 1500);
    }
  
  }
}