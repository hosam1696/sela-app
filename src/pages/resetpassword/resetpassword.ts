import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {ResetActiveSlide} from "../../providers/types/enums";
import {UsersProviders} from "../../providers/users";


@IonicPage()
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {
  @ViewChild(Slides) resetSlide: Slides;
  activeSlide: ResetActiveSlide|string = ResetActiveSlide.phone;
  phoneInput: string| any = '';
  emailInput: string| any = '';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userProvider: UsersProviders) {
  }

  changeSlide(num: number):void {
    this.activeSlide = num;
    this.resetSlide.slideTo(num)
  }

  resetPassword() {
    let type = ResetActiveSlide[this.activeSlide],
    obj = {
      type,
      [type]: this.activeSlide?this.emailInput:this.phoneInput
    };
    this.userProvider.resetPassword(obj)
      .subscribe(data=>{
        console.log(data);
      })
  }
}
