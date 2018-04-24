import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';

@IonicPage()
@Component({
  selector: 'page-deliverystatus',
  templateUrl: 'deliverystatus.html',
})
export class DeliverystatusPage {
  order: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public orderProvider: OrdersProvider
            ) {
  }

  ionViewDidLoad() {
    this.order = this.navParams.get('order');
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
    this.orderProvider.updateOrderStatus({id: this.order.id})
      .subscribe(data=>{
        console.log(data);
      })

  }

}
