import { Injectable, inject } from '@angular/core';
import { DataService } from '../common/data/data.service';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user';
import { NotificationService } from '../common/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private dataService: DataService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  canActivate(): boolean {
    if(this.dataService.user?.sitzung !== undefined) {
      return true;
    }

    let username = sessionStorage.getItem("fap_currentuser")?.toString();
    let authSessionId = sessionStorage.getItem("fap_authsessionid")?.toString();

    if(!username || !authSessionId) {
      this.router.navigateByUrl('/authentication')
      return false;
    }

    let user: User = {
      loginName: username,
      sitzung: authSessionId
    }
    this.dataService.user = user;
    this.notificationService.success("Session restored.");

    return true;
  }
}
