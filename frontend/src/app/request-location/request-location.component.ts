import { AfterViewInit, Component } from '@angular/core';
import { User } from '../models/user';
import { RequestLocationService } from './request-location.service';
import * as Leaflet from 'leaflet';
import { MapOptions } from 'leaflet';

@Component({
  selector: 'app-request-location',
  templateUrl: './request-location.component.html',
  styleUrls: ['./request-location.component.scss']
})
export class RequestLocationComponent implements AfterViewInit {
  users: {
    "loginName": string,
    "sitzung": string,
    "standort": {
        "breitengrad": number,
        "laengengrad": number
    }
}[] = [
    {
      loginName: "adama",
      sitzung: "",
      standort: {
        breitengrad: 51.992706,
        laengengrad: 6.902117
      }
    },
    {
      loginName: "berndb",
      sitzung: "",
      standort: {
        breitengrad: 51.8517397,
        laengengrad: 6.6395545
      }
    },
    {
      loginName: "jpriemer",
      sitzung: "",
      standort: {
        breitengrad: 51.9529137,
        laengengrad: 6.9891851
      }
    }
  ];

  map: any;

  markers:  Leaflet.Marker[] = [
  ];


  constructor(
    private requestLocationService: RequestLocationService
  ){ 
  }

  ngAfterViewInit(): void {
    let map = Leaflet.map('map').setView([51.505, -0.09], 13);
    this.map = map;
    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    this.users.forEach(user=>{
      this.addMarkerToMap(user.standort.breitengrad,user.standort.laengengrad,user.loginName)
    })

    /*var place = {lat: 51.505, lng: -0.09};

    let marker = Leaflet.marker(place).bindPopup('test');

    marker.addTo(this.map);
    this.markers.push(marker)*/

  }

  addUser(searchString: string){
    console.log(searchString);
    this.addMarkerToMap(51.65, -0.12, searchString);
    if(this.users.findIndex(tmp => tmp.loginName == searchString) == -1){
      let tmpuser = this.requestLocationService.retrieveUserInformation(searchString);
      tmpuser.subscribe((result:any) => {
        console.log(result);
        if(result.loginName == searchString){
          this.users.push({
            loginName: result.loginName,
            sitzung: "",
            standort: {
              breitengrad: result.standort.breitengrad,
              laengengrad: result.standort.laengengrad
            }
          });
          this.addMarkerToMap(result.standort.breitengrad,result.standort.laengengrad,searchString)
        }          
      })
    }
  }
  removeUser(user: {
    "loginName": string,
    "sitzung": string,
    "standort": {
        "breitengrad": number,
        "laengengrad": number
    }}){
    let index = this.users.findIndex(tmp => tmp == user);
    console.log(index);
    this.users.splice(index,1);
    this.removeMarkerFromMap(user.standort.breitengrad,user.standort.laengengrad,user.loginName)
  }

  addMarkerToMap(pLat: number, pLon: number, name: string){
    this.map.remove();
    
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });

    let marker = Leaflet.marker({lat: pLat, lng: pLon}).bindPopup(name);
    this.markers.push(marker);

    let layerGroup = new Leaflet.LayerGroup(this.markers);

    let viewInfo = this.getViewInformation();

    let map = Leaflet.map('map').setView([viewInfo.lat, viewInfo.lon], viewInfo.zoom);
    this.map = map;
    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    layerGroup.addTo(this.map);

    //marker.addTo(this.map);
    this.markers.push(marker)
    
  }

  removeMarkerFromMap(pLat: number, pLon: number, name: string){
    //this.map.remove();
    
    this.markers.forEach(marker => {
      if(marker.getLatLng().lat == pLat && marker.getLatLng().lng == pLon){
        this.map.removeLayer(marker);
      }
      //this.map.removeLayer(marker);
    });
  }

  getViewInformation():{lat:number,lon:number,zoom:number}{
    let counter = 0;
    let latSum = 0;
    let lonSum = 0;
    let maxLat = 0;
    let minLat = 0;
    let maxLon = 0;
    let minLon = 0;
    this.users.forEach(user =>{
      counter++;
      let lat = user.standort.breitengrad;
      let lon = user.standort.laengengrad;
      latSum += lat;
      lonSum += lon
      /*
      if(maxLat == 0 || lat > maxLat) maxLat = lat;
      if(minLat == 0 || lat < minLat) minLat = lat;
      if(maxLon == 0 || lat > maxLon) maxLon = lon;
      if(minLon == 0 || lat < minLon) minLon = lon;
      */
    })


    
    return {
      lat: latSum/counter,
      lon: lonSum/counter,
      zoom: 10
    }
  }
}