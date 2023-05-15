import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { HttpClient } from '@angular/common/http';
import { Session } from '../models/session';
import { Registration } from '../models/registration';
import { User } from '../models/user';
import { PostalCodeResponse } from '../models/postalCodeResponse';
import { DataService } from '../common/data/data.service';
import { Router } from '@angular/router';
import { NotificationService } from '../common/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClient: HttpClient,
    private dataService: DataService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  addUser(user: Registration): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>("/api/addUser", user);
  }

  login(user: User): Observable<Session> {
    return this.httpClient.post<Session>("/api/login", user);
  }

  checkUsername(username: string) {
    return this.httpClient.get<ApiResponse>(`/api/checkLoginName?id=${username}`);
  }

  getCityFromPostalCode(postcode: string) {
    return this.httpClient.get<PostalCodeResponse>(`http://api.geonames.org/postalCodeSearchJSON?postalcode=${postcode}&username=advancedinternettech`);
  }

  logout() {
    this.httpClient.post<ApiResponse>(`/api/logout`, this.dataService.user).subscribe({
      next: (response) => {
        sessionStorage.removeItem("fap_currentuser");
        sessionStorage.removeItem("fap_authsessionid");
        this.dataService.user = undefined;
        this.router.navigateByUrl("/authentication");

        if(response.ergebnis !== true) {
          this.notificationService.error("Session is invalid. ");
        }
        else {
          this.notificationService.success("Logout succeeded!");
        }
      },
      error: (error) => {
        this.notificationService.error("Logout failed.");
      }
    })
  }

  validateSession(username: string, session: string) {
    return this.httpClient.get<ApiResponse>(`/api/validateSession?login=${username}&session=${session}`)
  }
}
