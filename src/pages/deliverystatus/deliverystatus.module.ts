import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliverystatusPage } from './deliverystatus';
import { OrdersProvider } from '../../providers/orders/orders';

@NgModule({
  declarations: [
    DeliverystatusPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliverystatusPage),
  ],
  providers: [
    OrdersProvider
  ]
})
export class DeliverystatusPageModule {}
