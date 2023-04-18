import { Injectable, inject } from '@angular/core';
import { DataService } from '../common/data/data.service';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

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

    this.router.navigateByUrl('/authentication')
    return false;
  }
}
