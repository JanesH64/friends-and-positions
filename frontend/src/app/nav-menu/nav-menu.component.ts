import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { DataService } from '../common/data/data.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {

  constructor(
    private authenticationService: AuthenticationService,
    private dataService: DataService) {}

  isUserAuthenticated(): boolean {
    return this.dataService.user?.sitzung !== undefined;
  }

  logout() {
    this.authenticationService.logout();
  }

}
