import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapsPage } from './maps';
import { Ionic2RatingModule} from "ionic2-rating";
import {AreasProvider} from "../../providers/areas/areas";
import { AppUtilFunctions } from '../../providers/utilfuns';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    MapsPage,
  ],
  imports: [
    IonicPageModule.forChild(MapsPage),
    Ionic2RatingModule,
    TranslateModule
  ],
  providers: [
    AreasProvider,
    AppUtilFunctions
  ]
})
export class MapsPageModule {}
