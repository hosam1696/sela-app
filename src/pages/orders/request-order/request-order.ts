import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../../providers/types/interface';
import { AppstorageProvider } from '../../../providers/appstorage/appstorage';
import {OrdersProvider} from "../../../providers/orders/orders";
import { AppUtilFunctions } from '../../../providers/utilfuns';
import { UsersProviders } from '../../../providers/users';
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
  loader: boolean = false;
  disableBtns: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appStorage: AppstorageProvider,
    public ordersProvider: OrdersProvider,
    public appUtils: AppUtilFunctions,
    public userProvider: UsersProviders,
  ) {
    this.orderDistination = this.navParams.get('pageData');
    this.userLocation = this.navParams.get('userLocation');
    console.log('Data from Maps', this.orderDistination, this.userLocation);
  }

  async ionViewDidLoad() {
    [this.localUser, this.token] = await Promise.all([this.appStorage.getUserData(), this.appStorage.getToken()]);
  }

  requestOrder(type) {
    if (this.orderRequests && this.orderRequests.trim()) {

     this.sendOrder(type);
    } else {
      this.appUtils.AppToast('يرجى كتابة الطلبية')
    }
  }

  private sendOrder(type) {
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
      delegate_id: this.orderDistination.delegate.id
      //total: orderType[type]?100:50
    };
    if (typeof this.orderDistination.restaurant.id == 'number') {
      orderObject['branch_id'] = this.orderDistination.restaurant.id // send the id of a restaurant from db
    } else {
      orderObject['place_id'] = this.orderDistination.restaurant.id // the restaurant is from google API
    }

    console.log('order', orderObject);
    [this.loader, this.disableBtns] = Array(2).fill(true);
    /*setTimeout(() => {
      [this.loader, this.disableBtns] = Array(2).fill(false);
      this.navCtrl.push('DeliverystatusPage', { order: {id: 15, notes: 'sfsdfsdf'}, orderDistination: this.orderDistination });

    }, 2000);*/

    this.ordersProvider.requestOrder(orderObject)
    .subscribe(data => {
      console.log(data);
      if (data.id) {
        [this.loader, this.disableBtns] = Array(2).fill(false);
        this.navCtrl.push('DeliverystatusPage', { order: data, orderDistination: this.orderDistination});
      }
    },()=>{

      [this.loader, this.disableBtns] = Array(2).fill(false);
      this.appUtils.AppToast('DEV: Token Validation')
      // hardcoded solution for expired token
      this.userProvider.refrehToken(this.token)
        .subscribe(data=>{
          console.log(data);
        })

    });
  }
}
