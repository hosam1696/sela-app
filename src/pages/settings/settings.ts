import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  appLang:string;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private appStorage: AppstorageProvider,
      public events: Events
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.appStorage.getAppLang()
      .then(lang=>this.appLang = lang);
  }

  changeLang(lang) {
    this.appLang = lang;
    this.events.publish('changeLang', lang)
  }

}
