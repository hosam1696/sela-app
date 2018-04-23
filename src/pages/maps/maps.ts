import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavParams, IonicPage, NavController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Place } from './place.model';
import { PlaceNearMap } from '../../providers/types/interface';

declare let google;

@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  appMarkers: any[] = [];
  mapPlaces: Place[] = []
  userlatlng: [number, number];
  loader: any = true;
  initMap: any;
  orderDestination = {
    restaurant: undefined,
    deligator: undefined
  };
  orderInfoOpen: boolean = false;
  infoWindow: any;
  restaurantName: string = '';
  constructor(public navCtrl: NavController,
    public geolocation: Geolocation,
    public navParams: NavParams) {
    this.initMap = this.navParams.get('pageData');
    console.log('Restaurant Location', this.initMap)
  }

  ionViewDidLoad() {
    this.getUserLocation()
      .then((latlng) => {
        this.loadMap(latlng);
      })
  }

  public getUserLocation() {
    return this.geolocation
      .getCurrentPosition()
      //TODO: may change the output to object {lat:-, ln:-}
      .then((data: Geoposition) => this.userlatlng = [data.coords.latitude, data.coords.longitude])
  }

  public loadMap(latlng = [-34.9290, 138.6010]): void {

    let latLng = new google.maps.LatLng(...latlng);
    let mapOptions = {
      center: latLng,
      zoom: 19,
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
    },
      request = {
        location: { lat: this.userlatlng[0], lng: this.userlatlng[1] },
        radius: 500,
        type: 'restaurant' // types of places we want to search for
      };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.infoWindow = new google.maps.InfoWindow();

    // stop loader
    this.loader = false;

    // search places
    if (!this.initMap) {
      let service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch(request, (results, status) => {
        console.log(results);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let makeMarker = (place) => {
            let placeLoc = place.geometry.location;
            let marker = new google.maps.Marker({
              map: this.map,
              position: placeLoc,
              icon: 'assets/imgs/res-pin.png',
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
              this.orderDestination.restaurant = { ...place, title: place.name, location: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}};
              this.restaurantName = this.orderDestination.restaurant.title;
            });
          };
          for (let i = 0; i < results.length; i++) {
            makeMarker(results[i]);
          }
        }

      });
    }


    // make markers
    let makeMarker = (place: Place) => {

      latLng = !Array.isArray(place.location) ? place.location : new google.maps.LatLng(...place.location); // Cairo;
      console.log('marker location', latLng);
      let marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: 'assets/imgs/' + place.type + '-pin.png',
        title: place.title
      });
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
    };

    this.mapPlaces.push(new Place(0, this.userlatlng, 'موقعى', 'user'));
    if (this.initMap) {
      this.mapPlaces.push(new Place(this.initMap.id,this.initMap.location, this.initMap.title, 'res', this.initMap.address, this.initMap.rating))
      this.setRestaurant(this.initMap);
    }
    console.log(this.mapPlaces);
    this.mapPlaces.forEach(place => {
      makeMarker(place)
    });

  }

  openPage(page: string, params: any = {}) {
    this.navCtrl.push(page, params)
  }

  private setRestaurant(restaurant: Place | any) {
    if (restaurant.type != 'user') {
      this.orderDestination.restaurant = restaurant;
      this.restaurantName = this.orderDestination.restaurant.title;
    }
  }

}
