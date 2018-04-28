import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackorderPage } from './trackorder';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';

@NgModule({
  declarations: [
    TrackorderPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackorderPage),
  ],
  providers: [
    AppstorageProvider
  ]
})
export class TrackorderPageModule {}
