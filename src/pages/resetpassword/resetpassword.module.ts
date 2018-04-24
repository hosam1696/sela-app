import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetpasswordPage } from './resetpassword';
import {UsersProviders} from "../../providers/users";
import {AppUtilFunctions} from "../../providers/utilfuns";

@NgModule({
  declarations: [
    ResetpasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ResetpasswordPage),
  ],
  providers: [
    UsersProviders,
    AppUtilFunctions
  ]
})
export class ResetpasswordPageModule {}
