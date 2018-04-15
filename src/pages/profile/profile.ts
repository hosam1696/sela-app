import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup} from "@angular/forms";
import {PageMode} from "../../providers/types/interface";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profileEditForm: FormGroup;
  pageMode: PageMode = {
    editMode: false,
    editText: 'EditProfile'
  };
  formMasks: any = {
    mobile: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
  };
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBUilder: FormBuilder
              ) {
  }

  ionViewDidLoad() {
    this.profileEditForm = this.formBUilder.group({});

  }


  openPage(page:string) {
    this.navCtrl.push(page)
  }

  submitForm() {

  }

  public changePageMode():boolean {
    return this.pageMode.editMode = !this.pageMode.editMode
  }
}
