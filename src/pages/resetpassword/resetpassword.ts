import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ResetActiveSlide} from "../../providers/types/enums";
import {UsersProviders} from "../../providers/users";
import {AppUtilFunctions} from "../../providers/utilfuns";


@IonicPage()
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {
  activeSlide: ResetActiveSlide|string = ResetActiveSlide.phone;
  phoneInput: string| any = '';
  emailInput: string| any = '';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userProvider: UsersProviders,
              public appUtils: AppUtilFunctions) {
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
        if (data.status == 0) {
          this.appUtils.AppToast(this.activeSlide?'البريد الالكترونى غير صحيح':'رقم الهاتف غير صحيح')
        } else {
          console.log(data)
        }
      })
  }
}
