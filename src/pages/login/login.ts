import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

 

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder) {

    this.loginForm = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', [Validators.required, Validators.minLength(4)]]
    })
  }

  submitForm() {
   console.log(this.loginForm)
  }
}
