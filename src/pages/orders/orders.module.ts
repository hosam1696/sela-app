import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersPage } from './orders';
import { OrdersProvider } from "../../providers/orders/orders";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    OrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersPage),
    TranslateModule
  ],
  providers: [
    OrdersProvider,
    AppstorageProvider,
  ]
})
export class OrdersPageModule {}
