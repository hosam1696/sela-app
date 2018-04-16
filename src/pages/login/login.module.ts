import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { TextMaskModule } from "angular2-text-mask";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {UsersProviders} from "../../providers/users";

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TextMaskModule,
  ],
  providers: [
    AppstorageProvider,
    UsersProviders,
  ]
})
export class LoginPageModule {}
