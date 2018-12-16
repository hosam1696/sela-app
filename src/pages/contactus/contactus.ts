import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserData} from "../../providers/types/interface";
import {UsersProviders} from "../../providers/users";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {AppUtilFunctions} from "../../providers/utilfuns";

@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactusPage {
  contactForm:FormGroup;
  localUser: UserData;
  token: string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public platform: Platform,
              public userProvider: UsersProviders,
              public appStorage: AppstorageProvider,
              public appUtils: AppUtilFunctions
              ) {
    this.makeContactForm();
  }

  async ionViewDidLoad() {
    [this.localUser, this.token] = await Promise.all([this.appStorage.getUserData(), this.appStorage.getToken()]);
    this.makeContactForm()
  }

  private makeContactForm() {
    this.contactForm = this.formBuilder.group({
      name: [this.localUser?this.localUser.name:'', !this.localUser?Validators.required:null],
      email: [this.localUser?this.localUser.email:'', !this.localUser?Validators.required:null],
      phone: [this.localUser?this.localUser.phone:'', !this.localUser?Validators.required:null],
      message: ['', Validators.required],
    })
  }

  submitContact() {
    if (this.contactForm.valid) {
      console.log(this.contactForm);
      const endpoint = this.localUser ? 'contactUs' : 'contact_Us';

      this.userProvider.contactAdmins({...this.contactForm.value, token: this.token}, endpoint)
        .subscribe(response=>{
           if (response.status) {
             this.appUtils.appToast('تم ارسال رسالتك بنجاح');
             this.navCtrl.pop()
           } else {
             this.appUtils.appToast('خطأ فى الخادم')
           }
        })
    } else {
      this.appUtils.appToast('يرجى ملىء البيانات')
    }
  }

}
