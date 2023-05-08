import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/apiResponse';
import { User } from '../models/user';
import { DataService } from '../common/data/data.service';
import { ApiBody } from '../models/apiBody';
import { PostalCodeResponse2 } from '../models/postalCodeResponse2';
import { Location } from '../models/location';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateLocationService {

  constructor(
    private httpClient: HttpClient,
    private dataService: DataService
  ) {}

  getCityFromPostalCode(postcode: string) {
    let user = this.dataService.user;
    let loginName = user?.loginName;
    return this.httpClient.get<PostalCodeResponse2>(`/api/getOrt?postalcode=${postcode}&username=${loginName}`);
  }

  getLocation(): any{
    let user = this.dataService.user;
    let sessionId = user?.sitzung;
    let loginName = user?.loginName;
    // TODO anpassen des Response Objektes
    return this.httpClient.get(`/api/getStandort?login=${loginName}&session=${sessionId}&id=${loginName}`);
  }

  getLocationByAddress(country: string, postalcode: string, city: string, street: string){
    // TODO anpassen des Response Objektes
    return this.httpClient.get<any>(`/api/getStandortPerAdresse?land=${country}&plz=${postalcode}&ort=${city}&strasse=${street}`);
  }

  updateLocation(pLat: number, pLon: number){
    let user = this.dataService.user;
    let sessionId = user?.sitzung;
    let loginName = user?.loginName;
    // TODO anpassen des Response Objektes
    return this.httpClient.put<ApiResponse>(`/api/setStandort`,{
      "loginName": loginName,
      "sitzung": sessionId,
      "standort": {
        "laengengrad": pLon,
        "breitengrad": pLat,
      }
    });
    
  }
}
