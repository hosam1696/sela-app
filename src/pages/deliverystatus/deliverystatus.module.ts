import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliverystatusPage } from './deliverystatus';
import { OrdersProvider } from '../../providers/orders/orders';
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {AppUtilFunctions} from "../../providers/utilfuns";
import { CallNumber } from '@ionic-native/call-number';
import { AngularFireDatabase } from 'angularfire2/database';

@NgModule({
  declarations: [
    DeliverystatusPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliverystatusPage),
  ],
  providers: [
    OrdersProvider,
    AppstorageProvider,
    AppUtilFunctions,
    CallNumber,
    AngularFireDatabase
  ]
})
export class DeliverystatusPageModule {}
