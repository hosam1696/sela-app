import {Component, ViewChild} from '@angular/core';
import {AlertController, AlertOptions, Events, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from "../pages/home/home";
import {TranslateService} from '@ngx-translate/core';
import {AppstorageProvider} from "../providers/appstorage/appstorage";
import {MenuPage, UserData} from "../providers/types/interface";


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
              public appStorage: AppstorageProvider
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Home', component: 'HomePage', icon: 'home'},
      {title: 'MyOrders', component: 'OrdersPage', icon: 'cart', params: {'userData':this.appStorage._USER_DATA}},
      {title: 'Settings', component: 'SettingsPage', icon: 'settings'},
      //{title: 'Wallet', component: 'WalletPage', icon: 'card'},
      {title: 'Cart', component: 'CartPage', icon: 'cart'},
      //{title: 'Login', component: 'LoginPage', icon: 'log-in', params: {openAsPage: true}},
      {title: 'Signup', component: 'SignupPage', icon: 'log-in'},
      {title: 'Logout', component: '', icon: 'log-out'}
    ];

  }

  initializeApp() {
    this.translateService.setDefaultLang('ar');
    this.translateService.use('ar');
    this.platform.ready().then(() => {

      this.appStorage.getUserData()
        .then((data: UserData) => {
          console.log('App component',data);
          this.rootPage = data.id ? 'HomePage' : 'LoginPage'
        }).catch(() => {
        this.rootPage = 'LoginPage'
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
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
            handler: () => {

              this.appStorage
                .clearEntries()
                .then(() => {
                  this.events.publish('changeRoot', 'LoginPage')
                })
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

  public openPage(page: MenuPage & string): void {

    if (page.title === 'Logout') {
      this.logout();
    } else if (page.title === 'Home') {
      this.nav.setRoot(page.component);
    } else if (typeof page == 'string') {
      this.nav.push(page)
    } else {
      console.log(page);
      this.nav.push(page.component, page.params || {})
    }
  }

  private logout(): void {
    this.events.publish('userLogout')
  }
}
