import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavParams, IonicPage, NavController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Place } from './place.model';
import {AreasProvider} from "../../providers/areas/areas";
import { AppUtilFunctions } from '../../providers/utilfuns';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
declare let google;
type LatLng = [number, number]|{lat:number,lng:number};
@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})

export class MapsPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  appMarkers: any[] = [];
  mapPlaces: Place[] = [];
  userlatlng: LatLng;
  loader: any = true;
  initMap: any;
  defaultRating: number = 4; // default rating value
  orderDestination = {
    restaurant: undefined,
    delegate: undefined
  };
  orderInfoOpen: boolean = false;
  infoWindow: any;
  restaurantName: string = '';
  restaurantAddress: string = '';
  nearbyDeligators: any[];
  userLogged: boolean = true;
  constructor(public navCtrl: NavController,
    public geolocation: Geolocation,
    public areasProvider: AreasProvider,
    public appUtils: AppUtilFunctions,
    public storage: AppstorageProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.initMap = this.navParams.get('pageData');
    console.log('Restaurant Location', this.initMap);
    this.userlatlng = this.navParams.get('userLocation');
    console.log('maps params user location', this.userlatlng);
    this.storage.getUserData().then(data => this.userLogged = Boolean(data && data.id))
    if (this.userlatlng) {
      this.loadMap(this.userlatlng);
      this.getNearestDelegates([(<any>this.userlatlng).lat,(<any>this.userlatlng).lng])
    } else {
      this.getUserLocation()
        .then((latlng) => {
          this.loadMap(latlng);
          this.getNearestDelegates([(<any>latlng).lat,(<any>latlng).lng])
        })
    }

  }
  private getNearestDelegates(userlatlng) {
    this.areasProvider.getNearestDelegates(userlatlng)
      .subscribe(data=>{
        console.log('nearest branch',data);
        let delegate = { ...data.branch, location: { lat: Number(data.branch.lat), lng: Number(data.branch.lng) }, type: 'delegate', title: data.branch.name, vicinity: data.branch.name};
          //new Place(data.id,{lat:data.lat, lng:data.lng}, data.name, 'user' /* make it user icon for now */, data.address, data.rating||this.defaultRating );/*init a default rating*/
        this.mapPlaces.push(delegate);
        this.orderDestination.delegate = delegate;
        this.makeMarker(delegate);
        console.log(this.orderDestination);
      })
  }

  public getUserLocation() {
    return this.geolocation
      .getCurrentPosition()
      //TODO: may change the output to object {lat:-, ln:-}
      .then((data: Geoposition) => this.userlatlng = ({ lat: data.coords.latitude, lng: data.coords.longitude }))
      .then(geo => {
        console.log('user geo', geo);
        return geo;
      })
  }

  public loadMap(latlng:LatLng = [-34.9290, 138.6010]): void {
    let maplatlng = Array.isArray(latlng)? latlng: [latlng.lat, latlng.lng];
    let latLng = new google.maps.LatLng(...maplatlng);
    let mapOptions = {
      center: latLng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      disableDefaultUI: true,
      styles: [
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.infoWindow = new google.maps.InfoWindow();

    // stop loader
    this.loader = false;

    // search places
    if (!this.initMap) { // if user do not selected any restaurant
      //this.appUtils.AppToast(JSON.stringify(request))
      this.getGoogleServices()
    }

    this.mapPlaces.push(new Place(0, this.userlatlng, 'موقعى', 'user'));
    if (this.initMap) {
      this.mapPlaces.push(new Place(this.initMap.id,this.initMap.location, this.initMap.title, 'rest', this.initMap.address, this.initMap.rating));
      this.setRestaurant(this.initMap);
    }
    console.log(this.mapPlaces);
    this.mapPlaces.forEach(place => {
      this.makeMarker(place, this.map)
    });

  }

  private getGoogleServices(radius: number = 500, type: string = 'overall') {

    const request = {
      location: new google.maps.LatLng((<any>this.userlatlng).lat, (<any>this.userlatlng).lng),
      radius,
      type // types of places we want to search for "food", "decor", "service", "restaurants" or "overall"
    };
    let service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch(request, (results, status) => {
      console.log('Places Results', results);
      //this.appUtils.AppToast('Places number -> '+ results.length,{position:'top'});
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        let makeMarker = (place) => {
          let placeLoc = place.geometry.location;
          let marker = new google.maps.Marker({
            map: this.map,
            position: placeLoc,
            animation: google.maps.Animation.DROP,
          });

          google.maps.event.addListener(marker, 'click', () => {
            console.log('marker clicked', marker, place);
            let htmlContent = `
                <b>&nbsp;&nbsp;  ${place.name || place.title}</b><br>
                ${(place.vicinity || place.address).split(',').join('<br>')}
              `;
            this.infoWindow.setContent(htmlContent);
            this.infoWindow.open(this.map, marker);
            this.orderDestination.restaurant = { ...place, title: place.name, location: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() } };
            this.restaurantName = this.orderDestination.restaurant.title;
            this.restaurantAddress = this.orderDestination.restaurant.vicinity
          });
        };
        for (let i = 0; i < results.length; i++) {
          makeMarker(results[i]);
        }
      } else {
        this.getGoogleServices(radius += 500);
      }

    });
  }

  // make markers
  private makeMarker (place: Place, map = this.map)  {

    let latLng = !Array.isArray(place.location) ? place.location : new google.maps.LatLng(...place.location); // Cairo;
    console.log('marker location', latLng);
    let markerOptions = {
      position: latLng,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: 'assets/imgs/' + place.type + '-pin.png',
      title: place.title
    };
    let marker = new google.maps.Marker(markerOptions);
    this.appMarkers.push(marker);
    marker.addListener('click', () => {
      debounce(marker);
      console.log('marker clicked', marker, place);
      let htmlContent = `
                <b>&nbsp;&nbsp;  ${place.title}</b><br>
                ${place.vicinity.split(',').join('<br>')}
              `;
      this.infoWindow.setContent(htmlContent);
      this.infoWindow.open(this.map, marker);
      this.setRestaurant(place);
    });

    function debounce(marker) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
          marker.setAnimation(null);
        }, 850)
      }
    }
    marker.setMap(this.map);
  }

  openPage(page: string, params: any = {}) {
    this.navCtrl.push(page, params)
  }

  private setRestaurant(restaurant: Place | any) {
    if (restaurant.type != 'user' && restaurant.type != 'delegate') {
      this.orderDestination.restaurant = restaurant;
      this.restaurantName = this.orderDestination.restaurant.title;
      this.restaurantAddress = this.orderDestination.restaurant.vicinity || this.orderDestination.restaurant.address
    }
    console.log('Restaurant ', this.orderDestination.restaurant);
  }

  requestOrder() {
    if (this.userLogged) {

      if (!this.orderDestination.restaurant) {
        this.appUtils.AppToast('يرجى اختيار المطعم اولاً', { position: 'middle', cssClass:'centered'})
      } else if (!this.orderDestination.delegate) {
        this.appUtils.AppToast('يرجى اختيار المندوب اولا', { position: 'middle', cssClass: 'centered' })
      } else {
        this.openPage('RequestOrderPage', { pageData: this.orderDestination, userLocation: this.userlatlng })
      }
    } else {
      console.error('you must log in');
      this.appUtils.AppToast('يجب التسجيل أولا لاستكمال الطلب')
    }
  }

  }
