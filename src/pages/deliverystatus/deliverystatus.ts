import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {AppUtilFunctions} from "../../providers/utilfuns";
import { CallNumber } from '@ionic-native/call-number';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserData } from '../../providers/types/interface';

@IonicPage()
@Component({
  selector: 'page-deliverystatus',
  templateUrl: 'deliverystatus.html',
})
export class DeliverystatusPage {
  order: any;
  token: string;
  orderSides: any;
  localUser: UserData;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public orderProvider: OrdersProvider,
              public storageProvider: AppstorageProvider,
              public appUtils: AppUtilFunctions,
              public callNumber: CallNumber,
              public db: AngularFireDatabase
            ) {
  }

  async ionViewDidLoad() {
    this.order = this.navParams.get('order');
    this.orderSides = this.navParams.get('orderDistination');
    this.token = await this.storageProvider.getToken();
    this.localUser = await this.storageProvider.getUserData();
    console.log('Order Details ', this.order, this.orderSides);
    //this.db.list('/chats').push(`room-${this.orderSides.delegate.id}-${this.localUser.id}`);
  }

  openPage(page: string, params:any = {}) {
    if (page === 'HomePage') {
      this.navCtrl.setRoot('HomePage')
    } else {
      this.navCtrl.push(page, params)
    }
  }

  dialNumber(phone:string):void {
    // use call plugin to make phone call
    this.callNumber.callNumber(phone, true);
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
