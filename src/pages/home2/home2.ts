import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UsersProviders } from '../../providers/users';
import { Geolocation, Geoposition } from "@ionic-native/geolocation";


@IonicPage()
@Component({
  selector: 'page-home2',
  templateUrl: 'home2.html',
})
export class Home2Page {
  userLocation: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appStorage: AppstorageProvider,
    public userProvider: UsersProviders,
    public geoLocation: Geolocation
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Home2Page');
  }

  public getLocation(): Promise<[number, number]> {
    return this.geoLocation.getCurrentPosition()
      .then((locData: Geoposition) => {
        return this.userLocation = { lat: locData.coords.latitude, lng: locData.coords.longitude };
      }, (err) => {
        //TODO Get the nearest location
        console.log('Error launching GeoLocation')
      }).then((userLocation) => {
        return this.appStorage.saveLocation(this.userLocation)
          .then(data => {
            // TODO: reminder to be removed in production
            console.info('User Location saved', data);
            return data
          })
      }).catch(err => {
        //TODO Get the nearest location
        console.log('Error Getting GeoLocation Info', err)
      })
  }

  private openPage(page: string, params?: {}) {
    this.navCtrl.push(page, { userLocation: this.userLocation, ...params });
  }
}
