import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderPage } from './order';
import {OrdersProvider} from "../../../providers/orders/orders";
import {AppstorageProvider} from "../../../providers/appstorage/appstorage";

@NgModule({
  declarations: [
    OrderPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderPage),
  ],
  providers: [
    OrdersProvider,
  ]
})
export class OrderPageModule {}
