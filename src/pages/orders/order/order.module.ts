import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderPage } from './order';
import {OrdersProvider} from "../../../providers/orders/orders";
import { TranslateModule } from '@ngx-translate/core';
import { AppstorageProvider } from '../../../providers/appstorage/appstorage';
import { AppUtilFunctions } from '../../../providers/utilfuns';

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
    AppstorageProvider,
    AppUtilFunctions
  ]
})
export class OrderPageModule {}
