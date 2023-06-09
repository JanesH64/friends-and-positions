import { AfterViewInit, Component } from '@angular/core';
import { RequestLocationService } from './request-location.service';
import * as Leaflet from 'leaflet';
import { NotificationService } from '../common/notification/notification.service';
//import "leaflet/dist/images"

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
    }}[] = [];

  map: any;

  markers:  Leaflet.Marker[] = [];

  autoReload: boolean = false;
  reloadColour: string= 'green';


  constructor(
    private requestLocationService: RequestLocationService,
    private notificationService: NotificationService
  ){ 
  }

  ngAfterViewInit(): void {
    let map = Leaflet.map('request-location-map').setView([51.8392323, 6.6512868], 10);
    this.map = map;
    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    Leaflet.Icon.Default.imagePath = "assets/leaflet/"
    /*
    this.users.forEach(user=>{
      this.addMarkerToMap(user.standort.breitengrad,user.standort.laengengrad,user.loginName)
    })*/

    //this.requestLocationService.setLocation("hansi",52.0255391,6.8305445).subscribe();

    //this.requestLocationService.getUser().subscribe(res=> console.log(res));

    setInterval(()=>{
      if(this.autoReload == true){
        this.reloadUsers()
      }
    },30000)

  }

  addUser(searchString: string){
    console.log(searchString)
    if(this.users.findIndex(tmp => tmp.loginName == searchString) == -1){
      let tmpuser = this.requestLocationService.retrieveUserInformation(searchString);
      tmpuser.subscribe((result:any) => {
        //console.log(result);
        if(result.ergebnis != false){
          this.users.push({
            loginName: searchString,
            sitzung: "",
            standort: {
              breitengrad: result.standort.breitengrad,
              laengengrad: result.standort.laengengrad
            }
          });        
          this.addMarkerToMap(result.standort.breitengrad,result.standort.laengengrad,searchString);
        }else{
          console.error("Location not found!");
          this.notificationService.error("Location not found!");
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
    this.users.splice(index,1);    
    this.removeMarkerFromMap(user.standort.breitengrad,user.standort.laengengrad,user.loginName)
  }

  addMarkerToMap(pLat: number, pLon: number, name: string){
    console.log(pLat, pLon, name);
    this.map.remove();
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });

    let marker = Leaflet.marker({lat: pLat, lng: pLon}).bindPopup(name);
    this.markers.push(marker);

    let layerGroup = new Leaflet.LayerGroup(this.markers);

    let viewInfo = this.getViewInformation();

    let map = Leaflet.map('request-location-map').setView([viewInfo.lat, viewInfo.lon], viewInfo.zoom);
    this.map = map;
    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    layerGroup.addTo(this.map);
  }

  removeMarkerFromMap(pLat: number, pLon: number, name: string){
    let index = -1;
    this.markers.forEach((marker) => {
      if(marker.getLatLng().lat == pLat && marker.getLatLng().lng == pLon){
        this.map.removeLayer(marker);
        index = this.markers.findIndex(tmpmarker => tmpmarker == marker);
      }
    });
    this.markers.splice(index,1);
    //console.log(this.markers);
  }

  getViewInformation():{lat:number,lon:number,zoom:number}{
    let counter = 0;
    let latSum = 0;
    let lonSum = 0;
    this.users.forEach(user =>{
      counter++;
      let lat = user.standort.breitengrad;
      let lon = user.standort.laengengrad;
      latSum += lat;
      lonSum += lon;
    })
    return {
      lat: latSum/counter,
      lon: lonSum/counter,
      zoom: 10
    }
  }

  catchEnterKey(event: KeyboardEvent, username: string){
    //console.log(event)
    if(event.key == "Enter"){
      this.addUser(username)
    }
  }

  reloadUsers(){
    console.log("reload")
    let changeUsers : any[] = [];
    this.users.forEach((user, index)=>{
      let tmpuser = this.requestLocationService.retrieveUserInformation(user.loginName);
      tmpuser.subscribe((result:any) => {
        if(result.ergebnis != false){
          if(result.standort.breitengrad != user.standort.breitengrad && result.standort.laengengrad != user.standort.laengengrad){          
            console.log("location changed!");
            this.users[index].standort = result.standort
            this.removeMarkerFromMap(user.standort.breitengrad, user.standort.laengengrad, user.loginName);
            this.addMarkerToMap(result.standort.breitengrad, result.standort.laengengrad, user.loginName);
          }
        }else{
          console.error("Location not found!");
          this.notificationService.error("Location not found!");
        }
      })      
    })
  }

  setAutoReload(){
    if(this.autoReload == false){
      this.autoReload = true;
    }else if(this.autoReload == true){
      this.autoReload = false;
    }
  }

}