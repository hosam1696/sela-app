import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import {UsersProviders} from "../../providers/users";
import {AreasProvider} from "../../providers/areas/areas";
import {DirectivesModule} from "../../directives/directives.module";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    DirectivesModule,
  ],
  providers: [
    UsersProviders,
    AreasProvider,
    AppstorageProvider
  ]
})
export class HomePageModule {}
