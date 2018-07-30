import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UsersProviders } from '../../providers/users';
import { Geolocation, Geoposition } from "@ionic-native/geolocation";
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-home2',
  templateUrl: 'home2.html',
})
export class Home2Page {
  userLocation: any;
  
  hideNotification: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appStorage: AppstorageProvider,
    public userProvider: UsersProviders,
    public translate: TranslateService,
    public platform: Platform,
    public camera: Camera,
    public geoLocation: Geolocation,
    private actionCtrl: ActionSheetController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Home2Page');
  }

  public getLocation(): Promise<[number, number]> {
    return this.geoLocation.getCurrentPosition()
      .then((locData: Geoposition) => {
        return this.userLocation = { lat: locData.coords.latitude, lng: locData.coords.longitude };
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

  private openPage(page: string, params?: {}) {
    this.navCtrl.push(page, { userLocation: this.userLocation, ...params });
  }

  public pickImage() {
    // cameraImage defines we select to change (avatar | cover) image

    let actionSheetCtrl = this.actionCtrl.create({
      title: this.translate.instant("اختر من"),
      buttons: [
        {
          text: this.translate.instant("الكاميرا"),
          handler: () => {
            console.log("camera clicked");

            /* open camera*/
            this.openCamera("CAMERA");
          }
        },
        {
          text: this.translate.instant("البوم الصور"),
          handler: () => {
            console.log("Photo Album clicked");

            /*   open camera photo Library */
            this.openCamera("PHOTOLIBRARY");
          }
        },
        {
          text: "الغاء",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheetCtrl.present();
  }

  private openCamera(type: string = "CAMERA") {
    const cameraOptions: CameraOptions = {
      quality: type == "CAMERA" ? 70 : 40,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType[type]
    };

    // returned File URI => file:///storage/emulated/0/Android/data/co.itplus.rf/cache/.Pic.jpg?1498042093580
    /* response
    {"bytesSent":176215,"responseCode":200,"response":"/home/httpprim/rfapp.net<br>/api/uploadImage.
      php<pre>Array\n(\n
      [0] => \n [1] => api\n [2] => uploadImage.php\n)\n/home/httpprim/rfapp.net<br>/api","objectId":""} */

    this.camera
      .getPicture(cameraOptions)
      .then(imageData => {})
  }
}
