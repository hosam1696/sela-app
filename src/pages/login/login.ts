import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { MyVariabels } from "../../providers/variables";
import { UsersProviders } from "../../providers/users";
import { AppUtilFunctions } from '../../providers/utilfuns';//
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    loginForm:FormGroup;
    loader:boolean=false;
    openAsPage; boolean = false;
    constructor(
        private storage: Storage,
        public appUtils: AppUtilFunctions,
        public navCtrl: NavController,
        private formBuilder: FormBuilder ,
        public Vari: MyVariabels,
        public usersproviders: UsersProviders,
        public viewCtrl: ViewController,
        navParams: NavParams
    ) {
     this.loginForm =this.formBuilder.group({
         phone:['', Validators.required],
         password:['', Validators.required],
        });

        this.openAsPage = navParams.get('openAsPage')

    }

    closePage() {
        this.viewCtrl.dismiss();
    }

    goSignup() {
        this.navCtrl.push("SignupPage");
    }

    toForgotPass() {
        this.navCtrl.push('ResetpasswordPage')
    }
    goHomePage() {
        this.navCtrl.push('HomePage')
    }
     onSubmit(){
       if (this.loginForm.controls.phone.hasError('required')) {
         this.appUtils.AppToast("الرجاء إدخال رقم الموبابل");
       }
       else if (this.loginForm.controls.password.hasError('required')) {
         this.appUtils.AppToast("الرجاء إدخال  كلمة المرور");
       }
       else {

         //this.appUtils.AppToast();
         ///send data
         this.loader = true;
         // console.log('you have entered ', this.emailOrMobile, this.password);
         this.usersproviders.userLogin(this.loginForm.value)
           .subscribe((res) => {

             if (res.error) {
               this.appUtils.AppToast('البيانات غير متطابقة')
             } else {
               console.log(res);
               this.appUtils.AppToast('تم الدخول بنجاح');
               this.usersproviders.getUserData(res.token)
                 .subscribe(data=>{
                   console.log(data);
                   if (data.user) {
                     this.navCtrl.setRoot('HomePage')
                   }
                 })
             }
             // if (res.data) {
             //   console.log('this.userInfoLogin', res.data)
             //   this.storage.set('userInfo', res.data);
             //   // localStorage.removeItem('localUserInfo');
             //   // localStorage.setItem('localUserInfo', JSON.stringify(res.data))
             //   this.appUtils.AppToast("ﺗﻢ اﻟﺪﺧﻮﻝ ﺑﻨﺠﺎﺡ");
             //   this.navCtrl.setRoot('HomePage');
             //   this.loader = false;
             // }
             // else {
             //   if (res.errors.match) {
             //     this.appUtils.AppToast("ﻛﻠﻤﺔ اﻟﻤﺮﻭﺭ ﺧﺎﻃﺌﺔ ﺣﺎﻭﻝ ﻣﺮﺓ ﺃﺧﺮﻯ");
             //     this.loader = false;
             //   }
             //   else if (res.errors.notRegistered) {
             //     this.appUtils.AppToast("عفوا رقم الموبايل غير موجود");
             //     this.loader = false;
             //   }
             //
             // }


           });


         // console.log('Device registered', registration, registration.registrationId, this.platform.is('android') ? 'android' : 'ios');
       }
     }//end submit


}
