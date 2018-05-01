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
      .subscribe(response=>{
        this.orders = response.data;

        this.orders.forEach(order => {
          order['time'] = Math.abs(this.getMinutes(order));
          return order
        });;
        console.log('orders', this.orders);
        if (this.orders.length<1) {
          this.loader = false;
        }
      },err=>{
        this.loader= false
      },()=>{
        this.loader = false

      })
  }

  private getMinutes(order:any) {
    let minutes = <number>(<number>~new Date(order.delivery_date) - <number>~new Date(order.created_at)) / 1000 / 60;
    return minutes;
  }
  public openPage(page: string, order, orderNumber) {
    this.navCtrl.push(page, {order, localUser: this.localUser, orderNumber})
  }
  public getStatus(order:Order) {
    switch (order.status) {
      case 0:
        return this.localUser.role == 'user'?'فى انتظار موافقة المندوب':'فى انتظار موافقتك';
      case 1:
        return this.localUser.role == 'user' ?'يقوم المندوب بالتوصبل':'فى مرحلة توصيل الطلبية';
      case 2:
        return 'تم التوصبل';
      case 3:
        return 'تم الالغاء'
    }
  }

}
