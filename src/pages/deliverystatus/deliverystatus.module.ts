import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliverystatusPage } from './deliverystatus';
import { OrdersProvider } from '../../providers/orders/orders';
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {AppUtilFunctions} from "../../providers/utilfuns";
import { CallNumber } from '@ionic-native/call-number';

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
    CallNumber
  ]
})
export class DeliverystatusPageModule {}
