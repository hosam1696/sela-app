import { Component } from '@angular/core';
import {AlertController, AlertOptions, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup} from "@angular/forms";
import {PageMode, UserData} from "../../providers/types/interface";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {UsersProviders} from "../../providers/users";
import {AppUtilFunctions} from "../../providers/utilfuns";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profileEditForm: FormGroup;
  pageMode: PageMode = {
    editMode: false,
    editText: 'EditProfile'};
  formMasks: any = {mobile: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]};
  localUser: UserData;
  defaultRating: number = 4;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public appStorage: AppstorageProvider,
              public alertCtrl: AlertController,
              public events: Events,
              public userProvider: UsersProviders,
              public appUtils: AppUtilFunctions
              ) {
  }

  async ionViewDidLoad() {
    this.profileEditForm = this.formBuilder.group({});
    this.localUser = await this.appStorage.getUserData();

  }

  private initiateEditForm() {
    this.profileEditForm = this.formBuilder.group({
      'first_name': [this.localUser.first_name],
      'last_name': [this.localUser.last_name],
      'email': [this.localUser.email],
      'address': [this.localUser.address],
      'phone': [this.localUser.phone],
      'vehicle': [this.localUser.vehicle]
    })
  }
  openPage(page:string) {
    this.navCtrl.push(page)
  }

  submitForm() {
    console.log(this.profileEditForm.value);
    this.profileEditForm.get('phone').setValue(this.profileEditForm.get('phone').value.replace(/\s/g, ''));
    this.userProvider.updateUserInfo({id: this.localUser.id,token: this.localUser.token,...this.profileEditForm.value})
      .subscribe((data)=>{
        console.log(status, data[0]);
        if (data.status) {
          this.appUtils.AppToast('تم تعديل البيانات');
          data[0].name = data[0].first_name+ ' '+ data[0].last_name;
          this.localUser = data[0];
          this.appStorage.saveUserData(data[0])
            .then(()=>{
              this.events.publish('refreshStorage');
            })
        }

      }, err=>{
        console.warn(err)
      });
  }

  public changePageMode():boolean {
    if(!this.pageMode.editMode) {
      this.initiateEditForm()
    }
    return this.pageMode.editMode = !this.pageMode.editMode
  }

  changeImage() {

  }

  public logout(): void {
    let options:AlertOptions = {
      title:'هل ترغب فى تسجيل خروجك؟',
      buttons:[
        {
          text: 'نعم',
          handler: ()=> {
            this.appStorage
            .clearEntries()
            .then(() => {
             this.events.publish('changeRoot', 'LoginPage')
             })
          }
        }, {
          text: 'الغاء',
          handler: ()=>{}
        }
      ]
    };
    let alert = this.alertCtrl.create(options);
    alert.present()

  }
}
