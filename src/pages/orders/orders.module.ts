import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersPage } from './orders';
import { OrdersProvider } from "../../providers/orders/orders";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";

@NgModule({
  declarations: [
    OrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersPage),
  ],
  providers: [
    OrdersProvider,
    AppstorageProvider,
  ]
})
export class OrdersPageModule {}
