import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { HttpClient } from '@angular/common/http';
import { Session } from '../models/session';
import { Registration } from '../models/registration';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClient: HttpClient
  ) { }

  addUser(user: Registration): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>("/api/addUser", user);
  }

  login(user: User): Observable<Session> {
    return this.httpClient.post<Session>("/api/login", user);
  }
}
