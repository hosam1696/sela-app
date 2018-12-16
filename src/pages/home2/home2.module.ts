import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Home2Page } from './home2';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UsersProviders } from '../../providers/users';
import { TranslateModule } from '@ngx-translate/core';
import { AppUtilFunctions } from '../../providers/utilfuns';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    Home2Page,
  ],
  imports: [
    IonicPageModule.forChild(Home2Page),
    TranslateModule,
    ComponentsModule
  ],
  providers: [
    AppstorageProvider,
    UsersProviders,
    AppUtilFunctions
  ]
})
export class Home2PageModule {}
