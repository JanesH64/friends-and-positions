import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthGuardService } from './authentication/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { UpdateLocationComponent } from './update-location/update-location.component';


const IsUserAuthenticated: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(AuthGuardService).canActivate();
  };
  
const routes: Routes = [
  { path: 'authentication', component: AuthenticationComponent },
  { path: 'update-location', component: UpdateLocationComponent },
  { path: '', component: HomeComponent, canActivate: [IsUserAuthenticated] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
