import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../../providers/types/interface';
import { AppstorageProvider } from '../../../providers/appstorage/appstorage';
import {orderType} from "../../../providers/types/enums";
import {OrdersProvider} from "../../../providers/orders/orders";

//type orderType = 'normal' | 'rapid';

@IonicPage()
@Component({
  selector: 'page-request-order',
  templateUrl: 'request-order.html',
})
export class RequestOrderPage {
  orderDistination: any;
  orderRequests: string = '';
  localUser: UserData;
  token: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appStorage: AppstorageProvider,
              public ordersProvider: OrdersProvider
  ) {
    this.orderDistination = this.navParams.get('pageData');
    console.log('Data from Maps',this.orderDistination)
  }

  async ionViewDidLoad() {
    [this.localUser, this.token] = await Promise.all([this.appStorage.getUserData(), this.appStorage.getToken()]);
  }

  requestOrder(type: number) {
    let orderObject = {
      status: orderType[type],
      type: 'prepared',
      branch_name: this.orderDistination.restaurant?this.orderDistination.restaurant.name : '',
      notes: this.orderRequests,
      user_id: this.localUser.id,
      user_name: this.localUser.name,
      token: this.token
    };

    console.log('order', orderObject);
    this.ordersProvider.requestOrder(orderObject)
      .subscribe(data=>{
        console.log(data);

        this.navCtrl.push('order', orderObject);
      });
  }

}
