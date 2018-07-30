import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestOrderPage } from './request-order';
import { AppstorageProvider } from '../../../providers/appstorage/appstorage';
import {OrdersProvider} from "../../../providers/orders/orders";
import { AppUtilFunctions } from '../../../providers/utilfuns';
import { Ionic2RatingModule } from 'ionic2-rating';
import { UsersProviders } from '../../../providers/users';
import { TranslateModule } from '../../../../node_modules/@ngx-translate/core';

@NgModule({
  declarations: [
    RequestOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestOrderPage),
    Ionic2RatingModule,
    TranslateModule
  ],
  providers: [
    AppstorageProvider,
    OrdersProvider,
    AppUtilFunctions,
    UsersProviders
  ]
})
export class RequestOrderPageModule {}
