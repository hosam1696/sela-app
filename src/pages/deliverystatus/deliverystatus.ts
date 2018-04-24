import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';

@IonicPage()
@Component({
  selector: 'page-deliverystatus',
  templateUrl: 'deliverystatus.html',
})
export class DeliverystatusPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public orderProvider: OrdersProvider
            ) {
  }

  ionViewDidLoad() {

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
    this.orderProvider.updateOrderStatus({id: 47})
      .subscribe(data=>{
        console.log(data);
      })

  }

}
