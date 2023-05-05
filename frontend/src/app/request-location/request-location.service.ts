import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/apiResponse';
import { User } from '../models/user';
import { DataService } from '../common/data/data.service';
import { ApiBody } from '../models/apiBody';

@Injectable({
  providedIn: 'root'
})
export class RequestLocationService {

  constructor(
    private httpClient: HttpClient,
    private dataService: DataService
  ) {}

  retrieveUserInformation(username:string){
    let user = this.dataService.user;
    let sessionId = user?.sitzung;
    let login = user?.loginName;

    return this.httpClient.get<ApiResponse>(`/api/getStandort?login=${login}&session=${sessionId}&id=${username}`);
  }

  checkUsername(username: string) {
    return this.httpClient.get<ApiResponse>(`/api/checkLoginName?id=${username}`);
  }

  getUser(){
    let user = this.dataService.user;
    let sessionId = user?.sitzung;
    let login = user?.loginName;
    return this.httpClient.get<ApiResponse>(`/api/getBenutzer?login=${login}&session=${sessionId}`);
  }

  setLocation(login: string, pLat: number, pLon: number){
    let user = this.dataService.user;
    let sessionId = user?.sitzung;
    return this.httpClient.put<ApiResponse>(`/api/setStandort`,{
      "loginName": login,
      "sitzung": sessionId,
      "standort": {
        "laengengrad": pLon,
        "breitengrad": pLat,
      }
    })
  }
}
