import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  Platform,
  ToastController,
  Events
} from "ionic-angular";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { MyVariabels } from "../../providers/variables";
import { AppUtilFunctions } from "../../providers/utilfuns"; //
import { UsersProviders } from "../../providers/users";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FilePath } from "@ionic-native/file-path";
import { File } from "@ionic-native/file";
import { AppstorageProvider } from "../../providers/appstorage/appstorage";
import { UserData } from "../../providers/types/interface";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { TranslateService } from "../../../node_modules/@ngx-translate/core";
@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
  loader: boolean = false;
  cameraError: any;
  uploadLoader: boolean = false;
  signupForm: FormGroup;
  usertypeInput: HTMLInputElement;
  formMasks: any = {
    mobile: [/\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/]
  };
  location: any;
  locationText: string = 'الموقع الحالى';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public Vari: MyVariabels,
    public appUtils: AppUtilFunctions,
    public userProvider: UsersProviders,
    public actionCtrl: ActionSheetController,
    public camera: Camera,
    public platform: Platform,
    public file: File,
    public filePath: FilePath,
    public toastCtrl: ToastController,
    public appStorage: AppstorageProvider,
    public translate: TranslateService,
    public events: Events,
    public geolocation: Geolocation
  ) {
    this.signupForm = this.formBuilder.group({
      role: ["user", Validators.required],
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      avatar: [""],
      password: ["", Validators.required],
      confirm_password: ["", Validators.required],
      email: [
        "",
        [Validators.required, Validators.pattern(this.Vari.EMAIL_REGEXP)]
      ],
      phone: ["",[
          Validators.required,
          Validators.pattern(this.Vari.NUMBER_REGXP),
          Validators.minLength(9),
          Validators.maxLength(9)
        ]
      ],
      address: ["", Validators.required],
      agreeCondition: [false, Validators.required],
      vehicle: [""],
      c_code: ["966"],
      lat:[''],
      lng:['']
    });
  }

  submitForm() {
    if (this.signupForm.controls.first_name.hasError("required")) {
      this.appUtils.appToast("يرجى إدخال الاسم الاول");
    } else if (this.signupForm.controls.last_name.hasError("required")) {
      this.appUtils.appToast("يرجى إدخال الاسم الاخير");
    } else if (this.signupForm.controls.phone.hasError("required")) {
      this.appUtils.appToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ ﺭﻗﻢ اﻟﻤﻮﺑﺎﻳﻞ");
    } else if (this.signupForm.controls.email.hasError("required")) {
      this.appUtils.appToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ اﻟﺒﺮﻳﺪ اﻹﻟﻜﺘﺮﻭﻧﻲ");
    } else if (this.signupForm.controls.email.hasError("pattern")) {
      this.appUtils.appToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ ﺒﺮﻳﺪ اﻹﻟﻜﺘﺮﻭﻧﻲ ﺻﺤﻴﺢ");
    } else if (this.signupForm.controls.address.hasError("required")) {
      this.appUtils.appToast("يرجى إدخال العنوان  ");
    } else if (this.signupForm.controls.password.hasError("required")) {
      this.appUtils.appToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ ﻛﻠﻤﺔ اﻟﻤﺮﻭﺭ");
    } else if (this.signupForm.controls.confirm_password.hasError("required")) {
      this.appUtils.appToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ ﺗﺄﻛﻴﺪ ﻛﻠﻤﺔ اﻟﻤﺮﻭﺭ ");
    } else if (
      this.signupForm.controls.password.value !=
      this.signupForm.controls.confirm_password.value
    ) {
      this.appUtils.appToast("ﻋﻔﻮا ﻛﻠﻤﺘﺎ اﻟﻤﺮﻭﺭ ﻏﻴﺮ ﻣﺘﻄﺎﺑﻘﺘﻴﻦ");
    } else if (this.signupForm.controls.agreeCondition.value == false) {
      this.appUtils.appToast("يرجى القراءة والموافقة على الشروط والاحكام");
    } else {
      let signupData = {
        ...this.signupForm.value,
        name: this.concatWords("first_name", "last_name"),
        phone: this.signupForm.get("phone").value.replace(/\s/g, "")
      };
      this.loader = true;
      delete signupData.agreeCondition;
      delete signupData.confirm_password;

      // send form object to the server
      this.userProvider.userRegister(signupData).subscribe(
        async (res: UserData & { status: number; messages: string }) => {
          console.log('Register Response',res); //TODO: reminder to remove this line
          this.loader = false;
          if (res.id) {
            await this.appStorage.clearEntries();
            this.appUtils.appToast(this.translate.instant("تم التسجيل بنجاح"), {position:'top'});
            await this.appStorage.registerUserInStorage(res);
            this.events.publish("refreshStorage");
            this.navCtrl.setRoot("LoginPage");
          } else {
            console.log('Register Response',res); //TODO: reminder to remove this line
            if (res.status == 0) {
              let msg =
                res.messages === "this mail or phone already exists"
                  ? "البريد الالكترونى او الهاتف موجودين بالفعل"
                  : res.messages;
              this.appUtils.appToast(msg);
            }
          }
        },
        err => {
          this.loader = false;
          console.warn(err);
          this.appUtils.appToast("خطأ فى الخادم");
        },
        () => {
          this.loader = false;
        }
      );
    }
  } //end submit

  private concatWords(first: string, last: string): string {
    return (
      this.signupForm.get(first).value + " " + this.signupForm.get(last).value
    );
  }

  changeUserType(event) {
    this.signupForm.get("type_of_user").setValue(this.usertypeInput.value);
  }

  public pickImage() {
    // cameraImage defines we select to change (avatar | cover) image

    let actionSheetCtrl = this.actionCtrl.create({
      title: this.translate.instant("اختر من"),
      buttons: [
        {
          text: this.translate.instant("الكاميرا"),
          icon: "camera",
          handler: () => {
            console.log("camera clicked");

            /* open camera*/
            this.openCamera("CAMERA");
          }
        },
        {
          text: this.translate.instant("البوم الصور"),
          icon: "camera",
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
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType[type]
    };

    this.camera
      .getPicture(cameraOptions)
      .then(imageData => {
        // this.userProvider.uploadImage({profile_pic: imageData}, this.localUser.id)
      })
  }

  public getLocation() {
    this.locationText = '.....';
    return this.geolocation
      .getCurrentPosition()
      .then((data: Geoposition) => {
        this.signupForm.get('lat').setValue(data.coords.latitude);
        this.signupForm.get('lng').setValue(data.coords.longitude);
        this.locationText = 'تم حفظ موقعك';
      })
      .then(d => {
        console.log(d);
        console.log(this.signupForm.value);
      })
  }
}
