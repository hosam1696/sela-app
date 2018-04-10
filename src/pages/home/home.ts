import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  restaurant_category: string = 'all';
  constructor(public navCtrl: NavController) {

  }

  openPage(page:string) {
    this.navCtrl.push(page);
  }

  changeHomeCategory() {
    console.log(this.restaurant_category);

    // this.getCategory(this.restaurant_category)
  }

  // getcategories(category:string) {
  //
  // }
}
