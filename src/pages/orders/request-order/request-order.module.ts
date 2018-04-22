import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestOrderPage } from './request-order';
import { AppstorageProvider } from '../../../providers/appstorage/appstorage';
import {OrdersProvider} from "../../../providers/orders/orders";

@NgModule({
  declarations: [
    RequestOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestOrderPage),
  ],
  providers: [
    AppstorageProvider,
    OrdersProvider,
  ]
})
export class RequestOrderPageModule {}
