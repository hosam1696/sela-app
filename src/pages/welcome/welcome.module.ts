import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';
import { ConfigProvider } from '../../providers/config/config';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
    TranslateModule
  ],
  providers: [
    ConfigProvider
  ]
})
export class WelcomePageModule {}
