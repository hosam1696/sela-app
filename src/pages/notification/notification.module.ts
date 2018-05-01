import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPage } from './notification';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UsersProviders } from '../../providers/users';

@NgModule({
  declarations: [
    NotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationPage),
  ],
  providers: [
    AppstorageProvider,
    UsersProviders
  ]
})
export class NotificationPageModule {}
