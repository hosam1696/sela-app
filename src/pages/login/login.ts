import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { MyVariabels } from "../../providers/variables";
import { UsersProviders } from "../../providers/users";
import { AppUtilFunctions } from '../../providers/utilfuns';//
import {HomePage} from '../home/home';
import {SignupPage} from '../signup/signup';
// import {ForgetPassPage} from '../ForgetPass/ForgetPass';


// import {Signup} from '../signup/signup';
// import {ForgetPass} from '../forget-pass/forget-pass';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm:FormGroup;
    loader:boolean=false;
 
    constructor(
        public appUtils: AppUtilFunctions,
        public navCtrl: NavController,
        private formBuilder: FormBuilder ,
        public Vari: MyVariabels,
        public usersproviders: UsersProviders,


    ) {
     this.loginForm =this.formBuilder.group({
         user_name:['', Validators.required],
         password:['', Validators.required],  
           });

    }

    ionViewDidEnter() {
    }

    ionViewDidLoad() {
    }

    goSignup() {
        this.navCtrl.push("SignupPage");
    }

    // goForgetPass() {
    //     this.navCtrl.push(ForgetPass)
    // }
    goHomePage() {
        this.navCtrl.push(HomePage)
    }
     onSubmit(){ 
        if (this.loginForm.controls.user_name.hasError('required')) {
              this.appUtils.AppToast("الرجاء إدخال لسم المستخدم");
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
                    if(res.data) 
                         {
                        console.log('this.userInfoLogin',res.data)
                        // localStorage.removeItem('localUserInfo');
                        // localStorage.setItem('localUserInfo', JSON.stringify(res.data))
                         this.appUtils.AppToast("ﺗﻢ اﻟﺪﺧﻮﻝ ﺑﻨﺠﺎﺡ");
                        this.navCtrl.setRoot(HomePage);
                        this.loader = false;
                         }
                    else {
                            if (res.errors.match) {
                                this.appUtils.AppToast("ﻛﻠﻤﺔ اﻟﻤﺮﻭﺭ ﺧﺎﻃﺌﺔ ﺣﺎﻭﻝ ﻣﺮﺓ ﺃﺧﺮﻯ");
                                this.loader = false;
                             }
                            else if (res.errors.notRegistered) {
                                this.appUtils.AppToast("عفوا اسم المستخدم غير صحيح");
                                this.loader = false;
                             }

                          }
                  
            
              });
            // console.log('Device registered', registration, registration.registrationId, this.platform.is('android') ? 'android' : 'ios');
        }  
      }//end submit
}
