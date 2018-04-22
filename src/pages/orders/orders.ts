import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OrdersProvider} from "../../providers/orders/orders";
import {Order, UserData} from "../../providers/types/interface";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";


@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
  localUser: UserData;
  token: string;
  orders: Order[];
  loader: boolean = true;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public ordersProvider: OrdersProvider,
              public appStorage: AppstorageProvider
              ) {
  }

  async ionViewDidLoad() {
    // Get stored User Data
    [this.localUser, this.token] = await Promise.all([this.appStorage.getUserData(), this.appStorage.getToken()]);
    console.log('saved data', this.localUser, this.token);
    // Get User Orders
    this.getOrders(this.token)
  }

  getOrders(token: string){
    this.ordersProvider.getUserOrders(token)
      .subscribe(data=>{
        this.orders = data;
        if (this.orders.length<1) {
          this.loader = false;
        }
      },err=>{
        this.loader= false
      },()=>{
        this.loader = false

      })
  }

  public openPage(page: string, order, orderNumber) {
    this.navCtrl.push(page, {order, localUser: this.localUser, orderNumber})
  }

}
