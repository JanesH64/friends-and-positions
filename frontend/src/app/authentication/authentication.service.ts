import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { HttpClient } from '@angular/common/http';
import { Session } from '../models/session';
import { Registration } from '../models/registration';
import { User } from '../models/user';
import { PostalCodeResponse } from '../models/postalCodeResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  sessionId : string = "";

  constructor(
    private httpClient: HttpClient
  ) { }

  addUser(user: Registration): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>("/api/addUser", user);
  }

  login(user: User): Observable<Session> {
    let result = this.httpClient.post<Session>("/api/login", user);
    result.subscribe(res =>{
      this.sessionId = res.sessionID;
    })
    return result;
  }

  checkUsername(username: string) {
    return this.httpClient.get<ApiResponse>(`/api/checkLoginName?id=${username}`);
  }

  getCityFromPostalCode(postcode: string) {
    return this.httpClient.get<PostalCodeResponse>(`/api/getOrt?postalcode=${postcode}&username=advancedinternettech`);
  }

  getSessionId():string{
    return this.sessionId;
  }
}
