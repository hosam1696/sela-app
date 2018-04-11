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
import { Storage } from '@ionic/storage';
     
/**
 * Generated class for the EditprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {
    editInfo:any;
    userInfo:any;
    loader:boolean=false; 
  constructor( 
              private storage: Storage, 
              public navCtrl: NavController,
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
          this.storage.get('userInfo')
              .then((val) => {
             this.userInfo = val;
             this.getUserToEdit(this.userInfo);
       
            
          })
   
         
  }
   getUserToEdit(data){
      this.userInfo= data;
        console.log(this.userInfo);
  	    this.editInfo =this.formBuilder.group({
	         'first_name': [this.userInfo.first_name, Validators.required],
	         'last_name': [this.userInfo.last_name, Validators.required],
	         'e_mail': [this.userInfo.e_mail, Validators.compose([Validators.required, Validators.pattern(this.Vari.EMAIL_REGEXP)])],
	         'mobile':[this.userInfo.mobile ,Validators.compose([Validators.required, Validators.pattern(this.Vari.NUMBER_REGXP)])],
	         'address': [this.userInfo.address, Validators.required],
	         'password': ['', Validators.required],
	         'confirm_password': ['', Validators.required], 
	         'oldPassword':['', Validators.required],
	       });
       
   }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditprofilePage');
  }
 onSubmit() {
         console.log(' this.editInfo.value ', this.editInfo.value);
         if (this.editInfo.controls.first_name.hasError('required')) {
          this.appUtils.AppToast("يرجى إدخال الاسم الاول");
         } 
        else if (this.editInfo.controls.last_name.hasError('required')) {
          this.appUtils.AppToast("يرجى إدخال الاسم الاخير");
         } 
        else if (this.editInfo.controls.mobile.hasError('required')) {
              this.appUtils.AppToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ ﺭﻗﻢ اﻟﻤﻮﺑﺎﻳﻞ");
            }
        else if (this.editInfo.controls.mobile.hasError('pattern')) {
              this.appUtils.AppToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ ﺭﻗﻢ اﻟﻤﻮﺑﺎﻳﻞ ﺑﺸﻜﻞ ﺻﺤﻴﺢ");
            }
        else if (this.editInfo.controls.e_mail.hasError('required')) {
              this.appUtils.AppToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ اﻟﺒﺮﻳﺪ اﻹﻟﻜﺘﺮﻭﻧﻲ");
            }
        else if (this.editInfo.controls.e_mail.hasError('pattern')) {
              this.appUtils.AppToast("ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ اﻟﺒﺮﻳﺪ اﻹﻟﻜﺘﺮﻭﻧﻲ ﺑﺸﻜﻞ ﺻﺤﻴﺢ");
            }
        else if (this.editInfo.controls.address.hasError('required')) {
          this.appUtils.AppToast("يرجى إدخال العنوان  ");
         } 
 
        else if (this.editInfo.controls.oldPassword.hasError('required')) {
              this.appUtils.AppToast("يرجى إدخال كلمة المرور القديمة");
            }
        else if (this.editInfo.controls.password.value != this.editInfo.controls.confirm_password.value) {
                this.appUtils.AppToast("ﻋﻔﻮا ﻛﻠﻤﺘﺎ اﻟﻤﺮﻭﺭ ﻏﻴﺮ ﻣﺘﻄﺎﺑﻘﺘﻴﻦ");
            }
   

        else { 
          this.loader = true;
          this.editInfo.value.id=this.userInfo.id;
          this.usersproviders.userEdite(this.editInfo.value)
            .subscribe((res) => {
             // console.log('resgister.errors',res.errors);
            if (res.data) {  
              this.storage.remove('userInfo');
              this.storage.set('userInfo',res.data);
              this.appUtils.AppToast("ﺗﻢ ﺗﻌﺪﻳﻞ اﻟﺒﻴﺎﻧﺎﺕ ﺑﻨﺠﺎﺡ");
              this.loader = false;
                }
            else{
                 // console.log('errors.errors',res.errors);
                if(res.errors =='mobileExistMessage'){
                   this.appUtils.AppToast('ﻋﺬﺭا اﻟﻤﻮﺑﺎﻳﻞ اﻟﺬﻱ اﺩﺧﻠﺘﻪ ﻣﺴﺘﺨﺪﻡ ﻣﻦ ﻗﺒﻞ ﺷﺨﺺ اﺧﺮ');
                   this.loader = false;
                  }
                else if(res.errors =='emailExistMessage'){
                   this.appUtils.AppToast('ﻋﺬﺭا اﻟﺒﺮﻳﺪ اﻻﻟﻜﺘﺮﻭﻧﻲ اﻟﺬﻱ اﺩﺧﻠﺘﻪ ﻣﺴﺘﺨﺪﻡ ﻣﻦ ﻗﺒﻞ ﺷﺨﺺ اﺧﺮ');
                   this.loader = false;
                  }
                else if(res.errors =='oldPasswordNotCorrect'){
                   this.appUtils.AppToast('ﻛﻠﻤﺔ اﻟﻤﺮﻭﺭ اﻟﻘﺪﻳﻤﺔ ﻏﻴﺮ ﺻﺤﻴﺤﺔ ﺣﺎﻭﻝ ﻣﺮﺓ ﺃﺧﺮﻯ');
                   this.loader = false;
                  }
                 }
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
  
}
