import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OrdersProvider} from "../../../providers/orders/orders";
import {AppstorageProvider} from "../../../providers/appstorage/appstorage";
import {Order, UserData} from "../../../providers/types/interface";


@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  localUser: UserData;
  order: Order;
  orderNumber: number;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public ordersProvider: OrdersProvider
              ) {
      this.localUser = this.navParams.get('localUser');
      this.orderNumber = this.navParams.get('orderNumber');
      this.order = this.navParams.get('order');
  }

  ionViewDidLoad() {
    this.ordersProvider.getOrderById(this.order.id, this.localUser.token)
      .subscribe(data=>{
        console.log(data);
      })
  }

  openPage(page:string, params:any = {}) {
    this.navCtrl.push(page, params)
  }

}
