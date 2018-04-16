import {Component, ViewChild} from '@angular/core';
import {NavController, PopoverController, Slides, AlertController, IonicPage} from 'ionic-angular';
import {Push, PushObject, PushOptions} from '@ionic-native/push';
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
  restaurant_category: string = 'all';
  hideNotification: boolean = true;
  notificationIsOpen: boolean = false;
  userLocation: [number, number];
  allResaurants: any[];
  constructor(public navCtrl: NavController,
              public appUtils: AppUtilFunctions,
              public userProvider: UsersProviders,
              public appStorage: AppstorageProvider,
              public p: Push,
              public areasProvider: AreasProvider,
              public geoLocation: Geolocation
  ) {
  }

  ionViewDidLoad() {
    this.geoLocation.getCurrentPosition()
      .then((locData: Geoposition) => {
        this.userLocation = [locData.coords.latitude, locData.coords.longitude];
        this.appStorage
          .saveLocation(this.userLocation)
          .then(data => {
            console.log('data saved', data);

          })

      }, (err) => {
        //TODO Get the nearest location
        console.log('Error launching GeoLocation')
      });
    if (this.restaurant_category === 'all') {
      this.getAllBranches()
    }

  }

  getAllBranches() {
    this.areasProvider.getBrachType()
      .subscribe(data => {
        console.log(data);
        this.allResaurants = data;
      });
  }

  openPage(page: string, params?:{}) {
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
    if (this.restaurant_category === 'nearby') {
      this.getNearestBranches()
    }
    this.changeSlide(ResturantCategories[category]);
    // this.getCategory(this.restaurant_category)

  }

  getNearestBranches() {
    if(this.userLocation) {
      this.areasProvider.getNearestBranches(this.userLocation)
        .subscribe(data=>{
          console.log(data)
        })
    } else {
      console.warn('No user location sent fallback to get nearest location')
    }


  }
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
