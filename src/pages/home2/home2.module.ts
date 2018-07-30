import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Home2Page } from './home2';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UsersProviders } from '../../providers/users';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Home2Page,
  ],
  imports: [
    IonicPageModule.forChild(Home2Page),
    TranslateModule
  ],
  providers: [
    AppstorageProvider,
    UsersProviders
  ]
})
export class Home2PageModule {}
