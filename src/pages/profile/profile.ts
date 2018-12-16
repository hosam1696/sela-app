import { Component } from "@angular/core";
import {
  ActionSheetController,
  Events,
  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PageMode, UserData } from "../../providers/types/interface";
import { AppstorageProvider } from "../../providers/appstorage/appstorage";
import { UsersProviders } from "../../providers/users";
import { AppUtilFunctions } from "../../providers/utilfuns";
import {TranslateService} from "@ngx-translate/core";
import {Camera, CameraOptions} from "@ionic-native/camera";

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  profileEditForm: FormGroup;
  pageMode: PageMode = {
    editMode: false,
    editText: "EditProfile"
  };
  formMasks: any = {
    mobile: [/\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/]
  };
  localUser: UserData;
  token: string;
  defaultRating: number = 4;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public appStorage: AppstorageProvider,
    public events: Events,
    public translate: TranslateService,
    public camera: Camera,
    private actionCtrl: ActionSheetController,
    public userProvider: UsersProviders,
    public appUtils: AppUtilFunctions,
  ) {}

  async ionViewDidLoad() {
    this.profileEditForm = this.formBuilder.group({});

    [this.localUser, this.token] = await Promise.all([this.appStorage.getUserData(), this.appStorage.getToken()]);
  }

  private initiateEditForm() {
    this.profileEditForm = this.formBuilder.group({
      first_name: [this.localUser.first_name],
      last_name: [this.localUser.last_name],
      email: [this.localUser.email],
      address: [this.localUser.address],
      phone: [this.localUser.phone],
      vehicle: [this.localUser.vehicle]
    });
  }

  openPage(page: string) {
    this.navCtrl.push(page);
  }

  submitForm() {
    let editUserData = {
      ...this.profileEditForm.value,
      id: this.localUser.id,
      phone: this.profileEditForm.get("phone").value.replace(/\s/g, ""),
      token: this.token,
      name: this.concatWords('first_name', 'last_name')
    };

    this.userProvider.updateUserInfo(editUserData).subscribe(
      data => {
        let userData: UserData = data[0];
        console.log(status, userData);//TODO: remove this line
        if (data.status) {
          this.appUtils.appToast("تم تعديل البيانات بنجاح", {position:'middle', cssClass:'centered'});
          userData.token = this.localUser.token;
          this.appStorage.saveUserData(userData)
            .then((result) => {
              console.info('saveUserData Result', result);//TODO: remove this line
              this.localUser = result;
              this.pageMode.editMode = false;
              this.events.publish("refreshStorage");
            });
        }
      },
      err => {
        console.warn(err);
      }
    );
  }

  private concatWords(first: string = 'first_name', last: string= 'last_name'): string {
    return (
      this.profileEditForm.get(first).value + " " + this.profileEditForm.get(last).value
    );
  }

  public changePageMode(): boolean {
    if (!this.pageMode.editMode) {
      this.initiateEditForm();
    }
    return (this.pageMode.editMode = !this.pageMode.editMode);
  }

  public changeImage(imgId) {
    // do image upload

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
          icon: 'images',
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
      })
  }

  public logout(): void {
    this.events.publish('userLogout')
  }


}
