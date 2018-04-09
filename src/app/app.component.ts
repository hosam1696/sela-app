import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HomePage} from "../pages/home/home";
import {RequestsPage} from "../pages/requests/requests";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage', icon:'home'},
      { title: 'My Requests', component: 'RequestsPage',icon:'cart' },
      { title: 'Settings', component: 'SettingsPage',icon:'settings' },
      { title: 'Wallet', component: 'HomePage',icon:'card' },
      { title: 'Cart', component: 'CartPage',icon:'cart'},
      {title: 'Log in', component: 'LoginPage', icon: 'log-in'},
      { title: 'Log out', component: 'WalletPage',icon:'log-out'}
    ];

  }

  initializeApp() {
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
    if (typeof page.component == 'string') {
      this.nav.push(page.component);
    } else {
      this.nav.setRoot(page.component)
    }
  }
}
