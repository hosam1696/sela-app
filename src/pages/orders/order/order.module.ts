import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderPage } from './order';
import {OrdersProvider} from "../../../providers/orders/orders";
import { TranslateModule } from '@ngx-translate/core';
import { AppstorageProvider } from '../../../providers/appstorage/appstorage';

@NgModule({
  declarations: [
    OrderPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderPage),
    TranslateModule
  ],
  providers: [
    OrdersProvider,
    AppstorageProvider
  ]
})
export class OrderPageModule {}
