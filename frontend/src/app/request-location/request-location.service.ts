import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/apiResponse';
import { User } from '../models/user';
import { DataService } from '../common/data/data.service';

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
    return this.httpClient.get<ApiResponse>(`/api/getStandort?getBenutzer?login=${username}&session=${sessionId}`);
    ///getBenutzer?login=tester&session=ac7f5f1f-0685-4786-a5cc-26f798e90746
  }

  retrieveUserLocation(username:string){
    let user = this.dataService.user;
    let sessionId = user?.sitzung;
    let login = user?.loginName;
    return this.httpClient.get<ApiResponse>(`/api/getStandort?login=${login}&session=${sessionId}&id=${username}`);
  }

  checkUsername(username: string) {
    return this.httpClient.get<ApiResponse>(`/api/checkLoginName?id=${username}`);
  }
}
