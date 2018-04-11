import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationProvPage } from './notification-prov';

@NgModule({
  declarations: [
    NotificationProvPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationProvPage),
  ],
})
export class NotificationProvPageModule {}
