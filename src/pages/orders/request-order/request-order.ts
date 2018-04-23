import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../../providers/types/interface';
import { AppstorageProvider } from '../../../providers/appstorage/appstorage';
import {orderType} from "../../../providers/types/enums";
import {OrdersProvider} from "../../../providers/orders/orders";
import { AppUtilFunctions } from '../../../providers/utilfuns';

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
  userLocation: any;
  rating: number;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appStorage: AppstorageProvider,
    public ordersProvider: OrdersProvider,
    public appUtils: AppUtilFunctions
  ) {
    this.orderDistination = this.navParams.get('pageData');
    this.userLocation = this.navParams.get('userLocation');
    this.rating = this.orderDistination.restaurant.rating || 4;
    console.log('Data from Maps', this.orderDistination, this.userLocation);
  }

  async ionViewDidLoad() {
    [this.localUser, this.token] = await Promise.all([this.appStorage.getUserData(), this.appStorage.getToken()]);
  }

  requestOrder(type) {
    if (this.orderRequests && this.orderRequests.trim()) {
      let orderObject = {
        status: 0,
        type: type,
        branch_name: this.orderDistination.restaurant ? this.orderDistination.restaurant.title : '',
        branch_loc: JSON.stringify(this.orderDistination.restaurant.location),
        notes: this.orderRequests,
        user_id: this.localUser.id,
        //user_name: this.localUser.name,
        //address: this.orderDistination.restaurant.address,
        //user_location: this.userLocation,
        token: this.token,
        //total: orderType[type]?100:50
      };
      if (typeof this.orderDistination.restaurant.id == 'number') {
        orderObject['branch_id'] = this.orderDistination.restaurant.id
      } else {
        orderObject['place_id'] = this.orderDistination.restaurant.id
      }

      console.log('order', orderObject);
      this.ordersProvider.requestOrder(orderObject)
        .subscribe(data => {
          console.log(data);
          if (data.status) 
            //this.navCtrl.push('OrderPage', orderObject);
            this.appUtils.AppToast('تم ارسال الطلبية بنجاح', {}, () => {
              this.navCtrl.push('OrdersPage');
            })
        });
    } else {
      this.appUtils.AppToast('يرجى كتابة الطلبية')
    }
  }
}
