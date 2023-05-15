import { Injectable, inject } from '@angular/core';
import { DataService } from '../common/data/data.service';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user';
import { NotificationService } from '../common/notification/notification.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private dataService: DataService,
    private router: Router,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService
  ) { }

  async canActivate(): Promise<boolean> {
    if (this.dataService.user?.sitzung !== undefined) {
      return true;
    }

    let username = sessionStorage.getItem("fap_currentuser")?.toString();
    let authSessionId = sessionStorage.getItem("fap_authsessionid")?.toString();

    if (username === undefined || authSessionId === undefined) {
      this.router.navigateByUrl('/authentication')
      return false;
    }

    let response = await this.authenticationService.validateSession(username, authSessionId).toPromise();
    if (!response?.ergebnis) {
      this.router.navigateByUrl('/authentication')
      return false;
    }

    let user: User = {
      loginName: username!,
      sitzung: authSessionId!
    }
    this.dataService.user = user;
    this.notificationService.success("Session restored.");

    return true;
  }
}
