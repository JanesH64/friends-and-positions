import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { ApiResponse } from '../models/apiResponse';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class RequestLocationService {

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  retrieveUserInformation(username:string){
    let sessionId = "a02bba56-6a4e-476c-96c6-075eee1a43b6"
    //let sessionId = this.authenticationService.getSessionId();;
    return this.httpClient.get<ApiResponse>(`/api/getBenutzer?login=${username}&session=${sessionId}`);
  }

  checkUsername(username: string) {
    return this.httpClient.get<ApiResponse>(`/api/checkLoginName?id=${username}`);
  }
}
