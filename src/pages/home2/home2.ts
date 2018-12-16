import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {AppstorageProvider} from '../../providers/appstorage/appstorage';
import {UsersProviders} from '../../providers/users';
import {Geolocation, Geoposition} from "@ionic-native/geolocation";
import {TranslateService} from '@ngx-translate/core';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {UserData} from '../../providers/types/interface';
import {AppUtilFunctions} from '../../providers/utilfuns';


@IonicPage()
@Component({
    selector: 'page-home2',
    templateUrl: 'home2.html',
})
export class Home2Page {
    userLocation: any;
    localUser: UserData;
    hideNotification: boolean = true;
    selectedCar: any;
    carTypes: any[];
    showCarsList: boolean = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public appStorage: AppstorageProvider,
                public userProvider: UsersProviders,
                public translate: TranslateService,
                public platform: Platform,
                public camera: Camera,
                private utils: AppUtilFunctions,
                public geoLocation: Geolocation,
                private actionCtrl: ActionSheetController
    ) {
    }

    async ionViewDidLoad() {
        this.localUser = await this.appStorage.getUserData();
        this.carTypes = [
            {
                id: 1,
                name: 'سيارة توصيل طلبات',
                icon: 'assets/imgs/car-1.png',
                description: 'لنقل الاشياء صغيرة الحجم',
                vehicle_type: 'small'
            },
            {
                id: 2,
                name: 'سيارة صغيرة لنقل العفش',
                icon: 'assets/imgs/car-2.png',
                description: ' لنقل الأغراض كبيرة الحجم نسبياً',
                vehicle_type: 'medium'
            },
            {
                id: 3,
                name: ' سيارة  كبيرة لنقل العفش',
                icon: 'assets/imgs/car-3.png',
                description: ' لنقل الأغراض الثقيلة والكبيرة',
                vehicle_type: 'large',

            }
        ]
    }

    public getLocation(): Promise<[number, number]> {
        return this.geoLocation.getCurrentPosition()
            .then((locData: Geoposition) => {
                return this.userLocation = {lat: locData.coords.latitude, lng: locData.coords.longitude};
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

    public pickImage(imgId) {
        // cameraImage defines we select to change (avatar | cover) image

        let actionSheetCtrl = this.actionCtrl.create({
            title: this.translate.instant("اختر من"),
            buttons: [
                {
                    text: this.translate.instant("الكاميرا"),
                    icon: "camera",
                    handler: () => {
                        console.log("camera clicked");
                        this.openCamera("CAMERA", imgId);
                    }
                },
                {
                    text: this.translate.instant("البوم الصور"),
                    icon: "images",
                    handler: () => {
                        console.log("Photo Album clicked");
                        this.openCamera("PHOTOLIBRARY", imgId);
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

    save() {
        const carData = {
            vehicle_type: this.selectedCar.vehicle_type,
            id: this.localUser.id
        }
    }
    
    toggleCarSelect() {
        this.showCarsList = !this.showCarsList;
    }

    selectCarType($event: any) {
        this.selectedCar = $event;
    }

    private openCamera(type: string = "CAMERA", imgId) {
        const cameraOptions: CameraOptions = {
            quality: type == "CAMERA" ? 70 : 40,
            destinationType: this.camera.DestinationType.DATA_URL,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            allowEdit: true,
            sourceType: this.camera.PictureSourceType[type]
        };
        this.camera
            .getPicture(cameraOptions)
            .then(imageData => {
                this.userProvider.uploadImage({[imgId]: imageData}, this.localUser.id)
                    .subscribe(d => {
                        this.utils.appToast(JSON.stringify(d), {duration: 100000, showCloseButton: true});
                    }, err => {
                        this.utils.appToast(JSON.stringify(err), {duration: 100000, showCloseButton: true});
                    })
            })
    }
}
