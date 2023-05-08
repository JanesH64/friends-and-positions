import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthGuardService } from './authentication/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { RequestLocationComponent } from './request-location/request-location.component';
import { UpdateLocationComponent } from './update-location/update-location.component';


const IsUserAuthenticated: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(AuthGuardService).canActivate();
  };
  
const routes: Routes = [
  { path: 'authentication', component: AuthenticationComponent },
  { path: 'update-location', component: UpdateLocationComponent, canActivate: [IsUserAuthenticated] },
  { path: '', component: HomeComponent, canActivate: [IsUserAuthenticated] },
  { path: 'request-location', component: RequestLocationComponent, canActivate: [IsUserAuthenticated]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
