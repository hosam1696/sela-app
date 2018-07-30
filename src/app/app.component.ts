import { Component, ViewChild } from '@angular/core';
import { AlertController, AlertOptions, Events, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AppstorageProvider } from "../providers/appstorage/appstorage";
import { MenuPage, UserData } from "../providers/types/interface";
import { UsersProviders } from "../providers/users";
import { FcmProvider } from "../providers/fcm/fcm.provider";
import { UserHome } from '../providers/types/enums';

export type DocumentDirection = 'ltr' | 'rtl';
export enum AppDirLang {
  'ar' = 'rtl',
  'en' = 'ltr',
  'rtl' = 'ar',
  'ltr' = 'en'
}
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = UserHome['user'];
  userLogged: boolean = false;
  pages: MenuPage[] = [];

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public events: Events,
    public alertCtrl: AlertController,
    public appStorage: AppstorageProvider,
    public userProvider: UsersProviders,
    public firebase: FcmProvider
  ) {
    this.initializeApp();
    //this.appStorage.clearEntries()
  }

  initializeApp() {
    this.appStorage.getAppLang()
      .then(lang=>{
        this.setDefaultLang(lang?lang:'ar');
      })
    this.platform.ready()
      .then(() => {
        this.configPage();
        this.statusBar.backgroundColorByHexString('#f4f4f4');
        this.splashScreen.hide();
        this.handleDeviceNotifications()
      });

    // change root page event
    this.events.subscribe('changeRoot', (root) => {
      console.info('%c%s%c%s', 'color:#2196f3', 'changing root to > ', 'color:#f44336;font-weight:bold', root);
      this.nav.setRoot(UserHome['user']);
      this.configPage();
      this.rootPage = root
    });

    // change language
    this.events.subscribe('changeLang', lang=>{
      this.appStorage.setAppLang(lang).then(saveLang=>{
        this.setDefaultLang(saveLang);
      })
    });

    // refresh local storage event
    this.events.subscribe('refreshStorage', () => {
      this.configPage();
      this.appStorage.getUserData();
    });

    // Log out user event
    this.events.subscribe('userLogout', () => {
      let options: AlertOptions = {
        title: this.translate.instant('Do you Want to Logout?'),
        buttons: [
          {
            text: "yes",
            handler: async () => {
              const token = await this.appStorage.getToken();
              this.userProvider.userLogout(token)
                .subscribe(data => {
                  console.log(data);
                  if (data.status) {
                    this.appStorage
                      .clearEntries()
                      .then(() => {
                        this.events.publish('changeRoot', UserHome['user']/*'LoginPage'*/)
                      })
                  }

                });

            }
          },
          {
            text: "cancel",
            handler: () => { }
          }
        ]
      };
      let alert = this.alertCtrl.create(options);
      alert.present();
    })
  }

  private configPage() {
    this.appStorage.getUserData()
      .then((data: UserData) => {
        if (data&&data.saveLogin) {
          [this.userLogged, this.rootPage] = [true, UserHome[data.role]];
        } else {
            [this.userLogged, this.rootPage] = [false, UserHome['user']];
            this.appStorage.storage.remove('localUserInfo')
        }
        this.pages = this._menuPages;
      }).catch(() => {
        this.rootPage = UserHome['user'];//'LoginPage'
        this.pages = this._menuPages;

      });
  }
  private get _menuPages() {
    return [
      { title: 'Home', component: 'HomePage', icon: 'home' },
      { title: 'MyOrders', component: 'OrdersPage', icon: 'cart', hide: this.userLogged === false, params: { 'userData': this.appStorage._USER_DATA } },
      { title: 'Chats', component: 'ChatsPage', icon: 'chatbubbles', hide: this.userLogged === false },
      { title: 'Settings', component: 'SettingsPage', icon: 'settings' },
      //{title: 'Cart', component: 'CartPage', icon: 'cart'},
      { title: 'ContactUs', component: 'ContactusPage', icon: 'call' },
      { title: 'Login', component: 'LoginPage', icon: 'log-in', hide: this.userLogged === true, params: { openAsPage: true } },
      { title: 'Signup', component: 'SignupPage', icon: 'log-in', hide: this.userLogged === true },
      { title: 'Logout', component: '', icon: 'log-out', hide: this.userLogged === false }
    ];
  }
  private handleDeviceNotifications() {



    // Get Device Token
    this.firebase.getToken()
      .then((token: any) => {
        // save the device token in the data base
        this.sendDeviceToken(token);
      });

    // When the token is refreshed
    /*this.firebase.onTokenRefresh()
      .subscribe(token => {
        this.sendDeviceToken(token)
      });*/

    // this.firebase.onNotificationOpen()

  }


  private sendDeviceToken(token: string) {
    this.userProvider.sendDeviceToken(token)
      .subscribe(status => {
        console.log('Device Token Status', status);
        // may we save the token in the storage
      })
  }

  setDefaultLang(lang: 'en' | 'ar') {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.platform.setDir(AppDirLang[lang] as DocumentDirection, true);
  }

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
