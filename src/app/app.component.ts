import { Component, ViewChild } from '@angular/core';
import { AlertController, AlertOptions, Events, Nav, Platform, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AppstorageProvider } from "../providers/appstorage/appstorage";
import { MenuPage, UserData } from "../providers/types/interface";
import { UsersProviders } from "../providers/users";
import { FcmProvider } from "../providers/fcm/fcm.provider";
import { UserHome } from '../providers/types/enums';
type DocumentDirection = 'ltr' | 'rtl'
export enum langDir {
  'ar' = 'rtl',
  'en' = 'ltr',
  'rtl' = 'ar',
  'ltr' = 'en'
};
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any ;
  userLogged: boolean = false;
  pages: MenuPage[] = [];

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translateService: TranslateService,
    public events: Events,
    public alertCtrl: AlertController,
    public appStorage: AppstorageProvider,
    public userProvider: UsersProviders,
    public firebase: FcmProvider,
    public translate: TranslateService,
    public config: Config
  ) {
    this.initializeApp();
    //this.appStorage.clearEntries()

  }

  initializeApp() {
    this.platform.ready()
      .then(() => {
        this.configPage();
        this.statusBar.backgroundColorByHexString('#f4f4f4');
        this.splashScreen.hide();
        if (this.platform.is('cordova')) {
          this.handleDeviceNotifications()
        }
        this.subscribeEvents();
        this.events.publish('changeLang', 'ar');
      });

  }

  private subscribeEvents() {

    // refresh local storage event
    this.events.subscribe('refreshStorage', () => {
      this.configPage();
      this.appStorage.getUserData();
    });
    // change root page event
    this.events.subscribe('changeRoot', (root, getStored=true) => {
      console.info('%c%s%c%s', 'color:#2196f3', 'changing root to > ', 'color:#f44336;font-weight:bold', root);
      this.nav.setRoot(UserHome['user']);
      this.configPage(getStored?null:root);
    });
    // change app language
    this.events.subscribe('changeLang', lang => {
      lang = lang || 'ar';
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
      this.platform.setDir(langDir[lang] as DocumentDirection, true);
      //this.config.set('backButtonIcon', 'arrow-' + (lang === 'ar' ? 'forward' : 'back'));
      console.log('App Language', lang, this.translate.currentLang);
    })
    // Log out user event
    this.events.subscribe('userLogout', () => {
      let options: AlertOptions = {
        title: "هل ترغب فى تسجيل خروجك؟",
        buttons: [
          {
            text: "نعم",
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
            text: "الغاء",
            handler: () => { }
          }
        ]
      };
      let alert = this.alertCtrl.create(options);
      alert.present();
    });
  }
  private configPage(initPage?:string) {
    if (initPage) {
      this.rootPage = initPage
    } else {
      this.appStorage.isFirstLoad()
        .then(loaded => {
          console.log('App loaded Before', loaded);
          if (loaded == null) {
            this.rootPage = 'WelcomePage';
            this.appStorage.loadApp()
              .then(loaded => {
                console.log('App load', loaded)
              });
          } else {
            this.appStorage.getUserData()
              .then((data: UserData) => {

                if (data && data.id) {
                  this.userLogged = true;
                  this.rootPage = UserHome[data.role];
                } else {
                  this.userLogged = false;

                  this.rootPage = UserHome['user']; //'LoginPage'
                }
                this.pages = this._menuPages;
              }).catch(() => {
              this.rootPage = UserHome['user'];//'LoginPage'
              this.pages = this._menuPages;

            });
          }
        });

    }

  }
  private get _menuPages() {
    return [
      { title: 'Home', component: 'HomePage', icon: 'ios-home-outline' },
      { title: 'Profile', component: 'ProfilePage', icon: 'ios-person-outline', hide: this.userLogged === false },
      { title: 'location', component: 'MapsPage', icon: 'ios-pin-outline' },
      { title: 'MyOrders', component: 'OrdersPage', icon: 'ios-list-box-outline', hide: this.userLogged === false, params: { 'userData': this.appStorage._USER_DATA } },
      { title: 'Chats', component: 'ChatsPage', icon: 'ios-chatboxes-outline', hide: this.userLogged === false },
      { title: 'ContactUs', component: 'ContactusPage', icon: 'ios-call-outline' },
      { title: 'aboutus', component: 'AboutusPage', icon: 'ios-alert-outline' },
      { title: 'help', component: 'HelpusPage', icon: 'ios-help-outline' },
      { title: 'Settings', component: 'SettingsPage', icon: 'ios-settings-outline' },
      //{title: 'Cart', component: 'CartPage', icon: 'cart'},
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

  }


  private sendDeviceToken(token: string) {
    this.userProvider.sendDeviceToken(token)
      .subscribe(status => {
        console.log('Device Token Status', status);
        // may we save the token in the storage
      })
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
    this.events.publish('userLogout');
  }
}
