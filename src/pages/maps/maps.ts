import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavParams, IonicPage, NavController} from 'ionic-angular';
import { Geolocation} from '@ionic-native/geolocation';
// import {NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";

declare let google;

@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  loader: any = true;
  initMap: any;
  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public navParams: NavParams) {
    this.initMap = this.navParams.get('pageData');
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap(){

    let latLng = new google.maps.LatLng(-34.9290, 138.6010);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  }

  openPage(page: string, params:any = {}) {
    this.navCtrl.push(page, params)
  }

}
