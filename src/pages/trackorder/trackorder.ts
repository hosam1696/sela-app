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
    this.getUserLocation()
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
      }).then(latlng=>this.loadMap(latlng))
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

}
