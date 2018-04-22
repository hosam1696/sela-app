import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavParams, IonicPage, NavController} from 'ionic-angular';
import { Geolocation, Geoposition} from '@ionic-native/geolocation';

declare let google;

@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  appMarkers:any[] = [];
  userlatlng: [number, number];
  loader: any = true;
  initMap: any;
  orderDistinations = {
    restaurant: undefined,
    deligator: undefined
  };
  orderInfoOpen: boolean =  false;
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

  public loadMap(latlng = [-34.9290, 138.6010]): void {

    let latLng = new google.maps.LatLng(...latlng);
    let mapOptions = {
      center: latLng,
      zoom: 19,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      disableDefaultUI:true,
      styles: [
        {
          "featureType": "administrative.land_parcel",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.neighborhood",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]
    },
      request = {
        location: {lat: this.userlatlng[0], lng: this.userlatlng[1]},
        radius: 500,
        type: 'restaurant' // types of places we want to search for
      };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // stop loader
    this.loader = false;

    // search places
    if (!this.initMap) {
      let infowindow = new google.maps.InfoWindow();
      let service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch(request, (results,status)=> {
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
                <b>&nbsp;&nbsp;  ${place.name}</b><br>
                ${place.vicinity.split(',').join('<br>')}
              `;
              infowindow.setContent(htmlContent);
              infowindow.open(this.map, marker);
              this.orderDistinations.restaurant = place;
            });
          };
          for (let i = 0; i < results.length; i++) {
            makeMarker(results[i]);
          }
        }

      });
    }


    // make markers
    let makeMarker = (loc, title = 'my location') => {
      if (!Array.isArray(loc)) {
        console.log('geomtry',loc.lat(),loc.lng());
      }
      latLng = !Array.isArray(loc)?loc:new google.maps.LatLng(...loc); // Cairo;
      console.log('marker location', latLng);
      let marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: 'assets/imgs/user-pin.png',
        title
      });
      this.appMarkers.push(marker);
      marker.addListener('click', () => {
        debounce(marker);
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

    makeMarker(this.userlatlng);
    makeMarker(this.initMap, 'Restaurant')
    /*this.markers.forEach(place => {
      makeMarker(place.latlng, place.title);
    });*/
  }

  openPage(page: string, params:any = {}) {
    this.navCtrl.push(page, params)
  }

  getUserLocation() {
    // get the current location of user
  }

}
