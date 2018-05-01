import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppstorageProvider } from '../../../providers/appstorage/appstorage';
import { TimeSinceModule } from '@thisissoon/angular-timesince';
@NgModule({
  declarations: [
    ChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    TimeSinceModule
  ],
  providers: [
    AngularFireDatabase,
    AppstorageProvider
  ]
})
export class ChatPageModule {}
