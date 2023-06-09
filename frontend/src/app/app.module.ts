import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationComponent } from './authentication/authentication.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { HomeComponent } from './home/home.component';
import { environment } from 'src/environments/environment';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import { RequestLocationComponent } from './request-location/request-location.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { UpdateLocationComponent } from './update-location/update-location.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    NavMenuComponent,
    HomeComponent,
    RequestLocationComponent,
    UpdateLocationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressBarModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatDividerModule,
    MatTooltipModule,
    LeafletModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
