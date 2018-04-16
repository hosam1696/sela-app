import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { Ionic2RatingModule} from "ionic2-rating";
import {TextMaskModule} from "angular2-text-mask";
import {TranslateModule} from "@ngx-translate/core";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {UsersProviders} from "../../providers/users";

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    Ionic2RatingModule,
    TextMaskModule,
    TranslateModule.forChild()
  ],
  providers: [
    AppstorageProvider,
    UsersProviders
  ]
})
export class ProfilePageModule {}
