import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OrdersProvider} from "../../../providers/orders/orders";
import {AppstorageProvider} from "../../../providers/appstorage/appstorage";
import {Order, UserData} from "../../../providers/types/interface";
import { AppUtilFunctions } from '../../../providers/utilfuns';


@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  localUser: UserData;
  order: Order;
  orderNumber: number;
  token: string;
  loader: boolean = false;
  delegateUser: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public ordersProvider: OrdersProvider,
              public appProvider: AppstorageProvider,
              public appUtils: AppUtilFunctions
              ) {
      this.localUser = this.navParams.get('localUser');
      this.orderNumber = this.navParams.get('orderNumber')||1;
    this.order = this.navParams.get('order');
    this.delegateUser = this.navParams.get('delegate');
    console.log(this.navParams.data);
  }

  async ionViewDidLoad() {
    this.token = await this.appProvider.getToken();
    this.localUser = await this.appProvider.getUserData();
    if (this.order&&this.order.id&&!this.order.user_id) {
      this.getOrder(this.order.id)
    } else {
      console.warn('you have to pass an order')
    }

  }

  openPage(page:string, params:any = {}) {
    this.navCtrl.push(page, params)
  }

  private getOrder(id) {
    this.ordersProvider.getOrderById(id, this.token)
      .subscribe(data=>{
        console.log('order Data',data);
        this.order = data;
        this.delegateUser = this.navParams.get('delegate');
      })
  }

  changeOrderStatus(status: number) {
    let orderData = {
      id: this.order.id,
      status: status,
      token: this.token
    };
    this.ordersProvider.updateOrderStatus(orderData)
      .subscribe(result=>{
        console.log(result);
        if (result.status == status) {
          this.appUtils.appToast('تم التغيير بنجاح', { position: 'middle', duration: 1500 }, () => {
            this.navCtrl.pop();
          })
        }
      })
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
