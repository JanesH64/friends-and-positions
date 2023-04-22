import { Injectable, inject } from '@angular/core';
import { DataService } from '../common/data/data.service';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if(this.dataService.user?.session !== undefined) {
      return true;
    }

    let username = localStorage.getItem("fap_currentuser")?.toString();
    let authSessionId = localStorage.getItem("fap_authsessionid")?.toString();

    if(!username || !authSessionId) {
      this.router.navigateByUrl('/authentication')
      return false;
    }

    let user: User = {
      loginName: username,
      session: authSessionId
    }
    this.dataService.user = user;
    return true;
  }
}
