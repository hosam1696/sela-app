import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavParams, IonicPage, NavController} from 'ionic-angular';
import { Geolocation, Geoposition} from '@ionic-native/geolocation';

declare let google;
declare let debounce;
@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  userlatlng: [number, number];
  loader: any = true;
  initMap: any;
  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public navParams: NavParams) {
    this.initMap = this.navParams.get('pageData');
    console.log('Restaurant Location',this.initMap)
  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition()
      .then((data: Geoposition) => {
        this.userlatlng = [data.coords.latitude, data.coords.longitude];
        return this.userlatlng
      }).then((latlng) => {
        this.loadMap(latlng);
      })
  }

  public loadMap(latlng = [-34.9290, 138.6010]): void{

    let latLng = new google.maps.LatLng(...latlng);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let makeMarker = (loc, title = 'my location') => {
      latLng = new google.maps.LatLng(...loc); // Cairo;
      let marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        //draggable: true,
        animation: google.maps.Animation.DROP,
        title
      });
      this.markers.push(marker);
      marker.addListener('click', () => {
        debounce(marker);
      });
      marker.setMap(this.map);
    };

    makeMarker(this.userlatlng);
    makeMarker(this.initMap, 'Restaurant')
    /*this.markers.forEach(place => {
      makeMarker(place.latlng, place.title);
    });*/
  }

  openPage(page: string, params:any = {}) {
    this.navCtrl.push(page, params)
  }

}
