import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HomePage} from "../pages/home/home";
import { TranslateService } from '@ngx-translate/core';
import {ProfilePage} from "../pages/profile/profile";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';

  pages: Array<{title: string, component: any, icon: string, params?:any}>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translateService: TranslateService
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage', icon:'home'},
      { title: 'MyRequests', component: 'RequestsPage',icon:'cart' },
      { title: 'Settings', component: 'SettingsPage',icon:'settings' },
      { title: 'Wallet', component: 'WalletPage',icon:'card' },
      { title: 'Cart', component: 'CartPage',icon:'cart'},
      {title: 'Login', component: 'LoginPage', icon: 'log-in', params: {openAsPage: true}},
      { title: 'Signup', component: 'SignupPage', icon: 'log-in'},
      { title: 'Logout', component: 'WalletPage',icon:'log-out'}
    ];

  }

  initializeApp() {
    this.translateService.setDefaultLang('ar');
    this.translateService.use('ar');
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (typeof page == 'string') {
      this.nav.push(page)
    } else {
      this.nav.push(page.component, page.params || {})
    }
  }
}
