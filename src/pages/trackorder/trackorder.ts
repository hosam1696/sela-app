import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserData, LatLng } from '../../providers/types/interface';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
declare let google;
@IonicPage()
@Component({
  selector: 'page-trackorder',
  templateUrl: 'trackorder.html',
})
export class TrackorderPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  localUser: UserData;
  token: string;
  userlatlng: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,

    public modalCtrl: ModalController,
    public geolocation: Geolocation,
    public appStorage: AppstorageProvider, ) {
  }

  async ionViewDidLoad() {

    [this.localUser, this.token] = await Promise.all([this.appStorage.getUserData(), this.appStorage.getToken()]);
    this.getUserLocation();
    //this.initMap();
  }

  public openModal() {
    let modal = this.modalCtrl.create('FeedbacksPage', { localUser: this.localUser, token: this.token });
    modal.present()
  }

  public getUserLocation() {
    return this.geolocation
      .getCurrentPosition()
      //TODO: may change the output to object {lat:-, ln:-}
      .then((data: Geoposition) => this.userlatlng = ({ lat: data.coords.latitude, lng: data.coords.longitude }))
      .then(geo => {
        console.log('user geo', geo);
        return geo;
      }).then(latlng=>this.initMap(latlng))
  }

  public loadMap(latlng: LatLng = {lat:-34.9290, lng:138.6010}): void {
    let maplatlng = Array.isArray(latlng) ? latlng : [latlng.lat, latlng.lng];
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
  }

  initMap(userLatlng, deligatorLocation = { lat: 31.0367994, lng:31.366104800000016} ) {

    let pointA = new google.maps.LatLng(this.userlatlng.lat, this.userlatlng.lng),
      pointB = new google.maps.LatLng(deligatorLocation.lat, deligatorLocation.lng),
    myOptions = {
      zoom: 7,
      center: pointA,
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
    this.map = new google.maps.Map(this.mapElement.nativeElement, myOptions);
      // Instantiate a directions service.
    let directionsService = new google.maps.DirectionsService,
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: this.map
      });
      /*markerA = new google.maps.Marker({
        position: pointA,
        title: "point A",
        map: this.map
      }),
      markerB = new google.maps.Marker({
        position: pointB,
        map: this.map
      });*/

  // get route from A to B
  this.calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);

}

private calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
  directionsService.route({
    origin: pointB,
    destination: pointA,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
  }


}
