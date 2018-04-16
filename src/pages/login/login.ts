import { Component } from '@angular/core';
import {IonicPage, NavController, ViewController, NavParams, Events} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { UsersProviders } from "../../providers/users";
import { AppUtilFunctions } from '../../providers/utilfuns';
import {AppstorageProvider} from "../../providers/appstorage/appstorage";

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
        private appStorage: AppstorageProvider,
        public appUtils: AppUtilFunctions,
        public navCtrl: NavController,
        private formBuilder: FormBuilder ,
        public usersproviders: UsersProviders,
        public viewCtrl: ViewController,
        public events: Events,
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
       } else if (this.loginForm.controls.password.hasError('required')) {
         this.appUtils.AppToast("الرجاء إدخال  كلمة المرور");
       } else {
         this.loader = true;

         this.usersproviders
           .userLogin(this.loginForm.value)
           .subscribe((res) => {
             if (res.error) {
               this.appUtils.AppToast('البيانات غير متطابقة')
             } else {
               console.log(res);
               this.appStorage.saveToken(res.token);
               this.appUtils.AppToast('تم الدخول بنجاح');
               this.usersproviders.getUserData(res.token)
                 .subscribe(data=>{
                   console.log(data);
                   if (data.user) {
                     data.user.name = data.user.first_name +' ' + data.user.last_name; // concat the user name
                     this.appStorage.saveUserData(data.user)
                       .then(()=>{
                         this.events.publish('refreshStorage');
                         this.events.publish('changeRoot','HomePage');

                       });


                   }
                 })
             }
           },(err)=>{
             console.warn(err);
             this.appUtils.AppToast('الرجاء المحاولة فى وقت اخر')
           });
       }
     }


}
