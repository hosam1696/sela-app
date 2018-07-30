import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactusPage } from './contactus';
import {UsersProviders} from "../../providers/users";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {AppUtilFunctions} from "../../providers/utilfuns";
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';

@NgModule({
  declarations: [
    ContactusPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactusPage),
    TranslateModule
  ],
  providers: [
    UsersProviders,
    AppstorageProvider,
    AppUtilFunctions
  ]
})
export class ContactusPageModule {}
