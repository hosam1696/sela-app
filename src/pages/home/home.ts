import {Component, ViewChild} from '@angular/core';
import {NavController, Slides, IonicPage} from 'ionic-angular'
import {AppUtilFunctions} from '../../providers/utilfuns';//
import {UsersProviders} from "../../providers/users";
import {ResturantCategories} from '../../providers/types/enums';
import {AreasProvider} from "../../providers/areas/areas";
import {Geolocation, Geoposition} from "@ionic-native/geolocation";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) homeSlides: Slides;
  restaurant_category: string ;
  hideNotification: boolean = true;
  notificationIsOpen: boolean = false;
  userLocation: [number, number];
  allRestaurants: any[];
  nearbyRestaurants: any[];

  constructor(public navCtrl: NavController,
              public appUtils: AppUtilFunctions,
              public userProvider: UsersProviders,
              public appStorage: AppstorageProvider,
              public areasProvider: AreasProvider,
              public geoLocation: Geolocation
  ) {
    this.restaurant_category = 'all';
  }

  ionViewDidLoad() {
    // Get Client  current location
    this.getLocation();
    // Get restaurants
    if (this.restaurant_category === 'all') {
      this.getAllBranches()
    }

  }

  public getLocation(): Promise<[number, number]> {
    return this.geoLocation.getCurrentPosition()
      .then((locData: Geoposition) => {
        return this.userLocation = [locData.coords.latitude, locData.coords.longitude];
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

  openPage(page: string, params?: {}) {
    this.navCtrl.push(page, params);
  }

  ionViewWillLeave() {
    this.hideNotification = true;
    this.notificationIsOpen = false
  }

  fireEvent(event) {
    console.log(event, this.notificationIsOpen);
    if (this.notificationIsOpen && this.hideNotification)
      this.hideNotification = true
  }

  public changeHomeCategory(category: string): void {
    this.restaurant_category = category;
    console.log(this.restaurant_category);

    this.changeSlide(ResturantCategories[this.restaurant_category]);

    switch (this.restaurant_category) {
      case 'all':
        this.getNearestBranches();
        break;
      case 'nearby':
        this.getNearestBranches();
        break;
    }
  }

  getAllBranches() {
    this.areasProvider.getBrachType()
      .subscribe(data => {
        console.log(data);
        this.allRestaurants = data;
      });
  }

  getNearestBranches() {
    if (this.userLocation) {
      this.areasProvider.getNearestBranches(this.userLocation)
        .subscribe(data => {
          console.log(data);
          this.nearbyRestaurants = [data]
        })
    } else {
      //TODO: reminder for removing this line in production
      console.warn('No user location sent fallback to get nearest location');
      this.getLocation()
        .then((data) => {
          console.info('get data from location', data);
          this.getNearestBranches()
        })
    }


  }

  // Get Restaurant details by it's id
  fetchBranch(id: number) {
    this.areasProvider.getBranch(id)
      .subscribe(d => {
        console.log(d);
      })
  }


  public changeSlide(slideNum: number): void {
    this.homeSlides.slideTo(slideNum)
  }

}
