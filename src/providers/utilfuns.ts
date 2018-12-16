import {Injectable} from '@angular/core';
import { ToastController, ToastOptions, Platform, AlertController } from 'ionic-angular';
import "rxjs/add/operator/toPromise";
import { TranslateService } from '@ngx-translate/core';
@Injectable()

export class AppUtilFunctions {

    constructor(
        public toastCtrl: ToastController,
        public translate: TranslateService,
        public platform: Platform,
        private alertCtrl: AlertController
    ){}


    showLoginAlert(cb) {
        let alert = this.alertCtrl.create({
            title: this.translate.instant('Login is Required'),
            message: this.translate.instant('in order to continue and complete the process you must have an account.'),
            buttons: [
                {handler:()=>{
                    cb();
                }, text: this.translate.instant('login')}
            ]
        });
        alert.present();
    }
    public appToast(message:string, settings?:ToastOptions, callback?:any):void{
        let toast = this.toastCtrl.create({
          message, ...{
            duration: 2000,
            position: 'top',
            cssClass: 'toast-sm'
          }, ...settings
        });
        toast.onDidDismiss(callback)
        toast.present();
    }

    public GetPlatform() {
        return this.platform.is('ios')?'ios':(this.platform.is('windows')?'windows':'android')
    }

}

