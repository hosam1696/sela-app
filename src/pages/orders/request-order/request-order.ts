import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../../providers/types/interface';
import { AppstorageProvider } from '../../../providers/appstorage/appstorage';

type orderType = 'normal' | 'rapid';

@IonicPage()
@Component({
  selector: 'page-request-order',
  templateUrl: 'request-order.html',
})
export class RequestOrderPage {
  orderDistination: any;
  orderRequests: string = '';
  localUser: UserData;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appStorage: AppstorageProvider
  ) {
    this.orderDistination = this.navParams.get('pageData');
    console.log('Data from Maps',this.orderDistination)
  }

  async ionViewDidLoad() {
    this.localUser = await this.appStorage.getUserData()
  }

  requestOrder(type: orderType) {
    let orderObject = {
      type,
      restaurantName: this.orderDistination.restaurant.name,
      notes: this.orderRequests,
      userId: this.localUser.id,
      userName: this.localUser.name
    }

    console.log('order', orderObject)
  }

}
