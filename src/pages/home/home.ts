import {Component, ViewChild} from '@angular/core';
import {NavController, Slides, IonicPage, Platform} from 'ionic-angular'
import {AppUtilFunctions} from '../../providers/utilfuns';//
import {UsersProviders} from "../../providers/users";
import {ResturantCategories} from '../../providers/types/enums';
import {AreasProvider} from "../../providers/areas/areas";
import {Geolocation, Geoposition} from "@ionic-native/geolocation";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import { PlaceNearMap, UserData } from '../../providers/types/interface';
declare let google: any;


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) homeSlides: Slides;
  @ViewChild('map') mapElement: any;
  restaurant_category: string;
  hideNotification: boolean = true;
  notificationIsOpen: boolean = false;
  userLocation: {lat:number, lng:number};
  allRestaurants: any[];
  nearbyRestaurants: { featured: any[], locnear: PlaceNearMap[] } = {featured: [], locnear: []};
  activeRestaurants: any[];
  localUser: UserData;
  map: any;
  defaultRadius: number = 500;
  defaultSearchPlaces: string[] = ['restaurants', 'overall'];
  constructor(public navCtrl: NavController,
              public appUtils: AppUtilFunctions,
              public userProvider: UsersProviders,
              public appStorage: AppstorageProvider,
              public areasProvider: AreasProvider,
              public platform: Platform,
              public geoLocation: Geolocation
  ) {
    this.restaurant_category = 'nearby';
    //this.appStorage.clearEntries() // Dev Only clearing local storage
  }

  async ionViewDidLoad() {
    this.localUser = await this.appStorage.getUserData();
    //this.getNotifications(this.localUser.role);
    this.switchPlaces()

  }

  public getLocation(): Promise<[number, number]> {
    return this.geoLocation.getCurrentPosition()
      .then((locData: Geoposition) => {
        return this.userLocation = {lat:locData.coords.latitude, lng:locData.coords.longitude};
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
    this.navCtrl.push(page, {userLocation: this.userLocation, ...params});
  }

  ionViewWillLeave() {
    this.hideNotification = true;
    this.notificationIsOpen = false
  }

  getNotifications(userRole: string) {
    this.userProvider.getNotifications(userRole)
      .subscribe(data => {
        console.log('notifications data', data);
      })
  }

  fireEvent(event) {
    if (this.notificationIsOpen && this.hideNotification)
      this.hideNotification = true
  }

  public changeHomeCategory(category: string): void {
    this.restaurant_category = category;
    console.log(this.restaurant_category);

    this.changeSlide(ResturantCategories[this.restaurant_category]);

    this.switchPlaces();
  }

  private switchPlaces() {
    console.log('restaurant category', this.restaurant_category);
    switch (this.restaurant_category) {
      case 'all':
        this.getAllBranches();
        break;
      case 'nearby':
        this.getNearestBranches();
        break;
      case 'active':
        this.getActiveBranches();
    }
  }

  getAllBranches() {
    this.areasProvider.getBrachType()
      .subscribe(data => {
        console.log(data);
        this.allRestaurants = data.map(place=>this.makePlace(place));
      });
  }

  getNearestBranches() {

    if (this.userLocation) {
      // Get featured restaurants from DB
      this.areasProvider.getNearestBranches([this.userLocation.lat, this.userLocation.lng])
        .subscribe(data => {
          console.log(data);
          //TODO: remove the featured array and chenck the response
          data.lat = Number(data.lat);
          data.lng = Number(data.lng);
          data = this.makePlace(data);
          this.nearbyRestaurants.featured = Array.isArray(data) ? data : [data];
          console.log('this.nearby Restaurants', this.nearbyRestaurants);
        });
      // Get restaurants from Google Maps
      this.getGooglePlaces();

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

  getActiveBranches() {
    this.areasProvider.getActiveBranches()
      .subscribe(data => {
        console.log(data);
        this.activeRestaurants = data.map(place => this.makePlace(place));
        console.log(this.activeRestaurants);
      })
  }
  // Get Restaurant details by it's id
  fetchBranch(id: number) {
    this.areasProvider.getBranch(id)
      .subscribe(d => {
        console.log(d);
      })
  }
  private initMap() {
    const mapOptions = { center: this.userLocation, zoom: 19, mapTypeId: google.maps.MapTypeId.ROADMAP, fullscreenControl: false, };
    //TODO: Add feature to load more places by increasing the raduis value
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  private getGooglePlaces() {
    this.initMap();
    const service = new google.maps.places.PlacesService(this.map);
    this.getNearByServices(service);
  }

  private getNearByServices(service: any, radius: number = this.defaultRadius, type: any = this.defaultSearchPlaces) {
    const request = { location: new google.maps.LatLng(this.userLocation.lat, this.userLocation.lng), radius, type };
    service.nearbySearch(request, (results, status) => {
      console.info(status);
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        let finalResult = results.map(place => {
          let location = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
          return {
            location,
            distance: this.distanceTo(location),
            icon: place.icon,
            id: place.place_id,
            rating: place.rating,
            address: place.vicinity,
            title: place.name
          };
        });
        console.log('finalResult', results, finalResult);
        this.nearbyRestaurants.locnear = finalResult.sort((a, b) => a.distance > b.distance);
      } else if (status === 'ZERO_RESULTS') {
        this.getNearByServices(service, this.defaultRadius+=500)
      }
    });
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  public changeSlide(slideNum: number): void {
    this.homeSlides.slideTo(slideNum)
  }

  private distanceTo(location: {lat: number, lng: number}):number {
    const EARTH_RADIUS_KM = 6371;
    const toRad = x => x * (Math.PI / 180);
    let [lat1, lat2] = [toRad(this.userLocation.lat), toRad(location.lat)];
    let deltalng = toRad(location.lng - this.userLocation.lng);
    return 1000 * Math.acos(
      Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(deltalng)) * EARTH_RADIUS_KM;
  }

  private makePlace(place) {
    console.log(place);
    let location = { lat: Number(place.lat), lng: Number(place.lng) }
    return {
        location,
        distance: this.distanceTo(location),
        icon: 'assets/imgs/rest-alt.png',
        id: place.id,
        address: place.address,
        title: place.branch_name
      }

  }

}
