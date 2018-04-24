import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UsersProviders} from "../../providers/users";


@IonicPage()
@Component({
  selector: 'page-feedbacks',
  templateUrl: 'feedbacks.html',
})
export class FeedbacksPage {
  deliveryRating: number = 1;
  serviceRating: number = 1;
  ratingContent: string = '';
  params: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public userProvider: UsersProviders) {
  }

  ionViewDidLoad() {
    console.log('params data', this.navParams.data);
    this.params = this.navParams.data;
  }

  addReview() {
    let feedbackData = {
      user_id: this.params.localUser.id,
      delivery: this.deliveryRating,
      services: this.serviceRating,
      content: this.ratingContent,
      branch_id: 15,
      token: this.params.token
    };
    this.userProvider.addFeedBack(feedbackData)
      .subscribe(data=>{
        console.log(data);
        if (data.status == 'feedback created successfully') {
          this.dismissModal()
        }
      })
  }

  dismissModal() {
    this.viewCtrl.dismiss()
  }
}
