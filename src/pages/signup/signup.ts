import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signupForm: FormGroup;
  usertypeInput:HTMLInputElement;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder
              ) {
    this.signupForm = this.formBuilder.group({
      'type_of_user': [1, Validators.required],
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'avatar': [''],
      'password': ['', Validators.required],
      'confirm_password': ['', Validators.required, this.confirmPassword],
      'mobile': ['', Validators.required],
      'e_mail': ['', Validators.required],
      'address': ['', Validators.required]
    })
  }


  submitForm() {
    console.log(this.signupForm);
  }

  changeUserType(event) {
    this.signupForm.get('type_of_user').setValue( this.usertypeInput.value)
  }

  private confirmPassword(input:FormControl ):{ [s: string]: boolean } {
    if (!input.root || !input.root.value) {
      return null;
    }
    const exactMatch = input.root.value.password === input.value;

    return exactMatch ? null: {uninsured:true};
  }

}
