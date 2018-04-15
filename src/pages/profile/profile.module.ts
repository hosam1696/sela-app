import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { Ionic2RatingModule} from "ionic2-rating";
import {TextMaskModule} from "angular2-text-mask";
import {TranslateModule} from "@ngx-translate/core";

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
})
export class ProfilePageModule {}
