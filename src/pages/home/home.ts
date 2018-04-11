import { Component } from '@angular/core';
import { NavController,PopoverController  } from 'ionic-angular';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  restaurant_category: string = 'all';
  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController) {

  }

  openPage(page:string) {
    this.navCtrl.push(page);
  }
 presentPopover(myEvent) {
   console.log('asdasdds')
    let popover = this.popoverCtrl.create('NotificationProvPage');
    popover.present({

      ev: myEvent
    });
  }

  changeHomeCategory() {
    console.log(this.restaurant_category);

    // this.getCategory(this.restaurant_category)
  }

  // getcategories(category:string) {
  //
  // }


}
