import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatsPage } from './chats';
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {AngularFireDatabase} from "angularfire2/database";
import {TimeSinceModule} from "@thisissoon/angular-timesince";

@NgModule({
  declarations: [
    ChatsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatsPage),
    TimeSinceModule
  ],
  providers: [
    AppstorageProvider,
    AngularFireDatabase,
  ]
})
export class ChatsPageModule {}
