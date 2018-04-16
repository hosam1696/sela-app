import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetpasswordPage } from './resetpassword';
import {UsersProviders} from "../../providers/users";

@NgModule({
  declarations: [
    ResetpasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ResetpasswordPage),
  ],
  providers: [
    UsersProviders
  ]
})
export class ResetpasswordPageModule {}
