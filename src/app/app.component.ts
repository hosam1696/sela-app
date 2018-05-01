import {Component, ViewChild} from '@angular/core';
import {AlertController, AlertOptions, Events, Nav, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from "../pages/home/home";
import {TranslateService} from '@ngx-translate/core';
import {AppstorageProvider} from "../providers/appstorage/appstorage";
import {MenuPage, UserData} from "../providers/types/interface";
import {UsersProviders} from "../providers/users";
import {ContactusPage} from "../pages/contactus/contactus";
import {FcmProvider} from "../providers/fcm/fcm.provider";
import {tap} from "rxjs/operators";
import { UserHome } from '../providers/types/enums';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: MenuPage[];

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public translateService: TranslateService,
              public events: Events,
              public alertCtrl: AlertController,
              public appStorage: AppstorageProvider,
              public userProvider: UsersProviders,
              public fcm: FcmProvider
  ) {
    this.initializeApp();
    //this.appStorage.clearEntries()
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Home', component: 'HomePage', icon: 'home'},
      {title: 'MyOrders', component: 'OrdersPage', icon: 'cart', params: {'userData':this.appStorage._USER_DATA}},
      {title: 'Chats', component: 'ChatsPage', icon: 'chatbubbles'},
      {title: 'Settings', component: 'SettingsPage', icon: 'settings'},
      {title: 'Cart', component: 'CartPage', icon: 'cart'},
      { title: 'ContactUs', component: 'ContactusPage', icon: 'call'},
      //{title: 'Login', component: 'LoginPage', icon: 'log-in', params: {openAsPage: true}},
      {title: 'Signup', component: 'SignupPage', icon: 'log-in'},
      {title: 'Logout', component: '', icon: 'log-out'}
    ];

  }

  initializeApp() {
    this.translateService.setDefaultLang('ar');
    this.translateService.use('ar');
    this.platform.ready()
      .then(() => {

        this.appStorage.userLogStatus
          .then(logStatus => {
            console.log('logging status', logStatus);
            if (logStatus) {
              return this.appStorage.getUserData()
            } else {
              this.rootPage = 'LoginPage';
            }
          })
        .then((data: UserData) => {
          this.rootPage = data.id ? UserHome[data.role] : 'LoginPage'
        }).catch(() => {
        this.rootPage = 'LoginPage'
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.handleDeviceNotifications()
    });

    // change root page event
    this.events.subscribe('changeRoot', (root) => {
      console.info('%c%s%c%s', 'color:#2196f3', 'changing root to > ', 'color:#f44336;font-weight:bold', root);
      this.rootPage = root
    });

    // refresh local storage event
    this.events.subscribe('refreshStorage',()=>{
      this.appStorage.getUserData();
    });

    // Log out user event
    this.events.subscribe('userLogout', ()=> {
      let options: AlertOptions = {
        title: "هل ترغب فى تسجيل خروجك؟",
        buttons: [
          {
            text: "نعم",
            handler:  async () => {
              const token = await  this.appStorage.getToken();
              this.userProvider.userLogout(token)
                .subscribe (data=>{
                  console.log(data);
                  if (data.status) {
                    this.appStorage
                      .clearEntries()
                      .then(() => {
                        this.events.publish('changeRoot', 'LoginPage')
                      })
                  }

                });

            }
          },
          {
            text: "الغاء",
            handler: () => {}
          }
        ]
      };
      let alert = this.alertCtrl.create(options);
      alert.present();
    })
  }

  private handleDeviceNotifications() {

  }
    /*
      // Get Device Token
      this.firebase.getToken()
        .then(token=>{
          // save the device token in the data base
          this.sendDeviceToken(token);
        });

      // When the token is refreshed
      this.firebase.onTokenRefresh()
        .subscribe(token=>{
            this.sendDeviceToken(token)
        });

      // this.firebase.onNotificationOpen()

    */

/*
  private sendDeviceToken(token:string) {
    this.userProvider.sendDeviceToken(token)
      .subscribe(status=>{
        console.log('Device Token Status', status);
        // may we save the token in the storage
      })
  }*/

  public openPage(page: MenuPage & string): void {

    if (page.title === 'Logout') {
      this.logout();
    } else if (page.title === 'Home') {
      this.nav.setRoot(page.component);
    } else if (typeof page == 'string') {
      this.nav.push(page)
    } else {

      this.nav.push(page.component, page.params || {})
    }
  }

  private logout(): void {
    this.events.publish('userLogout')
  }
}
