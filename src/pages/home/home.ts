import { Component, ViewChild } from '@angular/core';
import { NavController, PopoverController, Slides, AlertController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AppUtilFunctions } from '../../providers/utilfuns';//
import { UsersProviders } from "../../providers/users";
import { ResturantCategories } from '../../providers/types/enums';


@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild(Slides) homeSlides: Slides;
    restaurant_category: string = 'all';
    constructor(public navCtrl: NavController,
        public popoverCtrl: PopoverController,
        private storage: Storage,
        public appUtils: AppUtilFunctions,
        public uservicesProviders: UsersProviders,
        public alertCtrl: AlertController,
        public p: Push,

    ) {
    }
    openPage(page: string) {
        this.navCtrl.push(page);
    }
    presentPopover(myEvent) {
        console.log('asdasdds')
        let popover = this.popoverCtrl.create('NotificationProvPage');
        popover.present({

            ev: myEvent
        });
    }

    public changeHomeCategory(category: string): void {
        console.log(this.restaurant_category);
        this.restaurant_category = category;
        this.changeSlide(ResturantCategories[category])
        // this.getCategory(this.restaurant_category)
    }
    ionViewWillEnter() {
        let pushOptios: PushOptions = {
            android: {
                senderID: '424015453780'
            },
            ios: {
                alert: 'true',
                badge: 'true',
                sound: 'true'
            },
            windows: {}
        };
        let push: PushObject = this.p.init(pushOptios);

        push.on('registration').subscribe((registration: any) => {

            let type = this.appUtils.GetPlatform();
            console.log('registrationId', registration.registrationId);
            let deviceData = {
                device_token_id: registration.registrationId,
                type: type
            }
            // this.appUtils.AppToast(deviceData.device_token_id);
            this.uservicesProviders.setdeviceTokeId(deviceData)
                .subscribe((res) => {
                    if (res.data != "device_token_isSet") {
                        localStorage.setItem('deviceData', JSON.stringify(deviceData))

                    }
                });
            //this.navCtrl.push(NotificationsDetails);      
        });
        push.on('notification').subscribe((notification: any) => {
            console.log('notification', JSON.stringify(notification));

            if (!notification.additionalData.foreground) {
                // this.navCtrl.push(NotificationsDetails, {id:notification.additionalData.id})
                // this.appUtils.AppToast(notification.additionalData.id); 

            }
            else {
                // this.appUtils.AppToast( notification.foreground);  
                let confirm = this.alertCtrl.create({
                    title: 'اﻧﺘﺒﻪ',
                    message: notification.message,
                    buttons: [

                        {
                            text: 'اﻋﺮﺽ اﻻﺷﻌﺎﺭ',
                            handler: () => {
                                // this.navCtrl.push(NotificationsDetails, {id:notification.additionalData.id})
                            }
                        },
                        {
                            text: 'ﺗﺠﺎﻫﻞ',
                            handler: () => {
                            }
                        }
                    ]
                });
                confirm.present();
            }

        });

    }

    public changeSlide(slideNum: number): void {
        this.homeSlides.slideTo(slideNum)
    }

}
