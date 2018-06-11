import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpusPage } from './helpus';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    HelpusPage,
  ],
  imports: [
    IonicPageModule.forChild(HelpusPage),
    TranslateModule
  ],
})
export class HelpusPageModule {}
