import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Slides } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage  implements AfterViewInit{
  @ViewChild(Slides) pageSlides:Slides;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
      public events: Events,
      public configProvider: ConfigProvider
    ) {
  }
  ngAfterViewInit() {
    this.pageSlides.lockSwipes(true);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  goTo(page:string) {
    this.navCtrl.push(page)
  }

  selectLang(lang) {
    // save lang
    this.events.publish('changeLang', lang);
    this.configProvider.changeLang(lang);
    this.pageSlides.lockSwipes(false);
    this.pageSlides.slideNext();
    this.pageSlides.lockSwipes(true);
    
  }

}
