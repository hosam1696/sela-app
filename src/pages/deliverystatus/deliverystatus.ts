import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {AppUtilFunctions} from "../../providers/utilfuns";

@IonicPage()
@Component({
  selector: 'page-deliverystatus',
  templateUrl: 'deliverystatus.html',
})
export class DeliverystatusPage {
  order: any;
  token: string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public orderProvider: OrdersProvider,
              public storageProvider: AppstorageProvider,
              public appUtils: AppUtilFunctions
            ) {
  }

  async ionViewDidLoad() {
    this.order = this.navParams.get('order');
    this.token = await this.storageProvider.getToken();
    console.log('Order Details ', this.order)
  }

  openPage(page: string, params:any = {}) {
    if (page === 'HomePage') {
      this.navCtrl.setRoot('HomePage')
    } else {
      this.navCtrl.push(page, params)
    }
  }

  dialNumber() {
    // use call plugin to make phone call
  }

  cancelOrder() {
    // change status of the order;
    this.orderProvider.updateOrderStatus({id: this.order.id, token: this.token})
      .subscribe(data=>{
        console.log(data);
        if (data.user_id) {
            this.appUtils.AppToast('تم الغاء طلبيتك', {duration:1000},()=>{
              this.navCtrl.popToRoot();
          });
        } else {
          this.appUtils.AppToast('حدث خطأ فى التعديل')
        }
      })

  }

}
