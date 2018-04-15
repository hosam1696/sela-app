import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ActionSheetController,Platform,ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import { MyVariabels } from "../../providers/variables";
import { AppUtilFunctions } from '../../providers/utilfuns';//
import { UsersProviders } from "../../providers/users";
import {HomePage} from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject, } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  loader:boolean=false;
  cameraError: any;
  uploadLoader:boolean=false;
  signupForm: FormGroup;
  usertypeInput: HTMLInputElement;
  formMasks: any = {
    mobile: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
  };
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public Vari: MyVariabels,
              public appUtils: AppUtilFunctions,
              public usersproviders: UsersProviders,
              public actionCtrl: ActionSheetController,
              public camera: Camera,
              public platform: Platform,
              public file: File,
              public filePath: FilePath,
              public transfer: FileTransfer,
              public toastCtrl: ToastController,

              ) {
    this.signupForm = this.formBuilder.group({
      'role': ['user', Validators.required],
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'avatar': [''],
      'password': ['', Validators.required],
      'confirm_password': ['', Validators.required],
      'email': ['', [Validators.required, Validators.pattern(this.Vari.EMAIL_REGEXP)]],
      'phone':['' ,[Validators.required, Validators.pattern(this.Vari.NUMBER_REGXP), Validators.minLength(9), Validators.maxLength(9)]],
      'address': ['', Validators.required],
      'agreeCondition': [false, Validators.required],
      'vehicle': [''],
      'c_code': ['966']
    })
  }


  submitForm() {
         console.log(' this.signupForm.value ', this.signupForm.value);
         if (this.signupForm.controls.first_name.hasError('required')) {
          this.appUtils.AppToast("يرجى إدخال الاسم الاول");
         }
        else if (this.signupForm.controls.last_name.hasError('required')) {
          this.appUtils.AppToast("يرجى إدخال الاسم الاخير");
         }
        else if (this.signupForm.controls.phone.hasError('required')) {
              this.appUtils.AppToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ ﺭﻗﻢ اﻟﻤﻮﺑﺎﻳﻞ");
            }

        else if (this.signupForm.controls.email.hasError('required')) {
              this.appUtils.AppToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ اﻟﺒﺮﻳﺪ اﻹﻟﻜﺘﺮﻭﻧﻲ");
            }
        else if (this.signupForm.controls.email.hasError('pattern')) {
              this.appUtils.AppToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ اﻟﺒﺮﻳﺪ اﻹﻟﻜﺘﺮﻭﻧﻲ ﺑﺸﻜﻞ ﺻﺤﻴﺢ");
            }
        else if (this.signupForm.controls.address.hasError('required')) {
          this.appUtils.AppToast("يرجى إدخال العنوان  ");
         }
        else if (this.signupForm.controls.password.hasError('required')) {
              this.appUtils.AppToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ ﻛﻠﻤﺔ اﻟﻤﺮﻭﺭ");
            }
        else if (this.signupForm.controls.confirm_password.hasError('required')) {
              this.appUtils.AppToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ ﺗﺄﻛﻴﺪ ﻛﻠﻤﺔ اﻟﻤﺮﻭﺭ ");
            }
        else if (this.signupForm.controls.password.value != this.signupForm.controls.confirm_password.value) {
                this.appUtils.AppToast("ﻋﻔﻮا ﻛﻠﻤﺘﺎ اﻟﻤﺮﻭﺭ ﻏﻴﺮ ﻣﺘﻄﺎﺑﻘﺘﻴﻦ");
            }
        else if (this.signupForm.controls.agreeCondition.value==false) {
          this.appUtils.AppToast("يرجى الموافقة على الشروط والاحكام");
         }

        else {
          this.loader = true;
          delete this.signupForm.value.agreeCondition;
          delete this.signupForm.value.confirm_password;
          this.signupForm.get('phone').setValue(this.signupForm.get('phone').value.replace(/\s/g,''));
          this.usersproviders.userRegister(this.signupForm.value)
            .subscribe((res) => {
              console.log(res);
                // if (res.data) {
                //   // localStorage.removeItem('localUserInfo');
                //   // localStorage.setItem('localUserInfo',JSON.stringify(res.data))
                //   this.appUtils.AppToast("ﺗﻢ ﺗﺴﺠﻴﻞ اﻟﺤﺴﺎﺏ ﺑﻨﺠﺎﺡ");
                //   this.navCtrl.push(HomePage)
                //  }
                // else{
                //       if(res.errors.e_mail){
                //        this.appUtils.AppToast("ﻋﺬﺭا اﻟﺒﺮﻳﺪ اﻻﻟﻜﺘﺮﻭﻧﻲ اﻟﺬﻱ اﺩﺧﻠﺘﻪ ﻣﺴﺘﺨﺪﻡ ﻣﻦ ﻗﺒﻞ ﺷﺨﺺ اﺧﺮ");
                //        this.loader = false;
                //         }
                //       else{
                //
                //        this.appUtils.AppToast("ﻋﺬﺭا اﻟﻤﻮﺑﺎﻳﻞ اﻟﺬﻱ اﺩﺧﻠﺘﻪ ﻣﺴﺘﺨﺪﻡ ﻣﻦ ﻗﺒﻞ ﺷﺨﺺ اﺧﺮ");
                //        this.loader = false;
                //        }
                //
                // }
              },err => {
                this.loader = false;
                // this.isOnline = false;
                // this.translateService.get('ErrorNetWorkConnection').subscribe(
                //   value => {
                //      this.appUtils.AppToast(value);
                //    })
            },() => {
                this.loader = false;
            });

         }
      }//end submit


  changeUserType(event) {
    this.signupForm.get('type_of_user').setValue( this.usertypeInput.value)
  }

   public pickImage() { // cameraImage defines we select to change (avatar | cover) image

    let actionSheetCtrl = this.actionCtrl.create({
      title: 'اختر من',
      buttons: [
        {
          text: 'الكاميرا',
          handler: () => {
            console.log('camera clicked');

            /* open camera*/
            this.openCamera('CAMERA');

          }
        },
        {
          text: 'البوم الصور',
          handler: () => {
            console.log('Photo Album clicked');

            /*   open camera photo Library */
            this.openCamera('PHOTOLIBRARY' );

          }
        },
        {
          text: 'الغاء',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');

          }
        }
      ]
    });
      actionSheetCtrl.present();
  }

private openCamera(type: string = 'CAMERA' ) {

    const cameraOptions: CameraOptions = {
      quality: (type=='CAMERA')?70:40,
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

    this.camera.getPicture(cameraOptions).then(imageData => {

      /* If data

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      let compressed = LZString.compressToUTF16(base64Image);
      console.log(compressed);
      */
      console.log('line 171 on promise resolve function', imageData);

      // Special handling for Android library
      if (this.platform.is('android') || type == 'PHOTOLIBRARY') {
        this.filePath.resolveNativePath(imageData)
          .then(filePath => {
            console.log('file path from resolve native path', filePath);
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
            console.log('correctPath', correctPath, 'currentName', currentName);
            //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        console.log('line 197 image file path', imageData);
        let currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
        let correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
        console.log('correctPath', correctPath, 'currentName', currentName);
        //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }



      // detect image extension
      let extension: string = imageData.substring(imageData.lastIndexOf('.') + 1, imageData.lastIndexOf('?') != -1 ? imageData.lastIndexOf('?') : imageData.length);

      console.log('file extension', extension);

      // window.alert(imageData + "  && " + extension);

      return Promise.resolve([imageData, extension])

    }).then(data => {

      this.uploadImage(data[0], data[1]);

    }).catch(err => {

      console.error('getPicture Error ', err);
      this.cameraError = err;
    })
  }

  // private createFileName() {
  //   var d = new Date(),
  //     n = d.getTime(),
  //     newFileName = n + ".jpg";
  //   return newFileName;
  // }

   private uploadImage(file, type) {
    file = (file.indexOf('?') != -1)?file.split('?')[0]:file;

    const fto: FileTransferObject = this.transfer.create();

    let fileName = file.substr(file.lastIndexOf('/') + 1);

    let uploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,
      chunkedMode: false,
      mimeType: "image/" + type,

    };

    let serverFile = this.Vari.API_URL + "uploadImage.php?uploadFolder=templates/default/uploads/avatars";

    this.uploadLoader =true;


    fto.upload(encodeURI(file), encodeURI(serverFile), uploadOptions, true)
      .then((res) => {
        //this.loadImage = true;
        this.showToast('جارى رفع الصورة');
        console.log('uploaded', JSON.stringify(res));
        this.uploadLoader = false;
      }, err => {
        //this.uploadErr = JSON.stringify(err);
        //this.showToast('upload' + JSON.stringify(err));
        console.log(err);
        this.uploadLoader = false;
        if (err.body) {
          //this.showToast('image name ' + err.body);
          console.log('%c%s', 'font-size:20px','Body message from the server', err.body);
          console.log(JSON.parse(err.body),JSON.parse(err.body).name);


          //this.showToast(err.json().errorInfo());
          this.showToast(JSON.parse(err.body).success)
          if (JSON.parse(err.body).name) {
            // this.userLocal[cameraImage] = JSON.parse(err.body).name;

            // localStorage.setItem('userLocalData', JSON.stringify(this.userLocal));
          }else {
            this.showToast(JSON.parse(err.body).errorInfo)
          }

        }
      });

  }
   public showToast(msg:string):void {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
