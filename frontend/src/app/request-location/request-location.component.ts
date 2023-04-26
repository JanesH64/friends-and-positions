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
  users: User[] = [
    {
      loginName: "adama",
      passwort: {passwort: ""},
      session: ""
    },
    {
      loginName: "berndb",
      passwort: {passwort: ""},
      session: ""
    },
    {
      loginName: "jpriemer",
      passwort: {passwort: ""},
      session: ""
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

    var place = {lat: 51.505, lng: -0.09};

    let marker = Leaflet.marker(place).bindPopup('test');

    marker.addTo(this.map);
    this.markers.push(marker)

  }

  addUser(searchString: string){
    console.log(searchString);
    this.addMarkerToMap(51.65, -0.12, searchString);
    if(this.users.findIndex(tmp => tmp.loginName == searchString) == -1){
      let tmpuser = this.requestLocationService.retrieveUserInformation(searchString);
      tmpuser.subscribe((result:any) => {
        result.benutzerliste.forEach( (userRes:any) =>{
          if(userRes.loginName == searchString){
            this.users.push({
              loginName: userRes.loginName,
              passwort: {passwort: ""},
              session: ""              
            });          
          }
        }
        )
      })
    }
  }
  removeUser(user: User){
    let index = this.users.findIndex(tmp => tmp == user);
    console.log(index);
    this.users.splice(index,1);
  }

  addMarkerToMap(pLat: number, pLon: number, name: string){
    this.map.remove();
    
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });

    let marker = Leaflet.marker({lat: pLat, lng: pLon}).bindPopup(name);
    this.markers.push(marker);

    let layerGroup = new Leaflet.LayerGroup(this.markers);

    let map = Leaflet.map('map').setView([51.505, -0.09], 10);
    this.map = map;
    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    layerGroup.addTo(this.map);

    //marker.addTo(this.map);
    this.markers.push(marker)
    
  }
}


  /*
  	 	// We’ll add a tile layer to add to our map, in this case it’s a OSM tile layer.
	 	// Creating a tile layer usually involves setting the URL template for the tile images
	 	var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	 	    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	 	    osm = L.tileLayer(osmUrl, {
	 	        maxZoom: 18,
	 	        attribution: osmAttrib
	 	    });

	 	// initialize the map on the "map" div with a given center and zoom
	 	var map = L.map('map').setView([19.04469, 72.9258], 12).addLayer(osm);
    var place = {lat: 19.064064852093967, lng: 72.91248321533203}

L.marker(place, {
	 	        draggable: true,
	 	        title: "Resource location",
	 	        alt: "Resource Location",
	 	        riseOnHover: true
	 	    }).addTo(map)
	 	       
	 	
  */