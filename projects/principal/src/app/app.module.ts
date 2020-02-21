import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { PrincipalComponent } from './principal/principal.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MaterialModule } from './material-modules';
import { MomentModule } from 'ngx-moment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FirebaseConfig } from '../environments/firebase.config';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppComponent, LoginComponent, PrincipalComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule, BrowserAnimationsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MomentModule,
    Ng2ImgMaxModule,
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
