import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { TextMaskModule } from 'angular2-text-mask';
import {UsersProviders} from "../../providers/users";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
    TextMaskModule
  ],
  providers: [
    UsersProviders,
    AppstorageProvider,
  ]
})
export class SignupPageModule {}
