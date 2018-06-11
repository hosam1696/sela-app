import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { TextMaskModule } from 'angular2-text-mask';
import {UsersProviders} from "../../providers/users";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
    TextMaskModule,
    TranslateModule
  ],
  providers: [
    UsersProviders,
    AppstorageProvider,
  ]
})
export class SignupPageModule {}
