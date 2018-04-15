import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AppAPI } from './api';
// import { Network } from '@ionic-native/network';

@Injectable()
export class UsersProviders {
  userInfo: any;

  constructor(
    public api: AppAPI
  ) {
  }
   userLogin(userData){
    return this.api.post('login', userData);
  }
  userRegister(userData) {

    return this.api.post('register', userData);
  }
  userEdite(userData) {
    return this.api.post('edituser', userData);
  }

  getUserData(token: string) {
    return this.api.get('user', {token})
  }

  getPlacesByPerantId(d) {
    //let data = JSON.stringify({uid});
    let data = JSON.stringify(Object.assign(d));
    // console.log('Data entered', data, typeof data);
    // console.log('this.Vari.API_URL', this.Vari.API_URL);
    return this.api.post('users.php?action=getPlaces', data);
  }
  forgetPassword(d) {
    //let data = JSON.stringify({uid});
    let data = JSON.stringify(Object.assign(d));
    // console.log('Data entered', data, typeof data);
    // console.log('this.Vari.API_URL', this.Vari.API_URL);
    return this.api.post('users.php?action=forgetPassword', data);
  }


  setdeviceTokeId(Da){
  let data = JSON.stringify(Object.assign(Da));
    return this.api.post('users.php?action=setDeviceToken', data);
  }
  // getToken() {
  //   return this.storage.get('userToken');
  // }
  // isUserLogin() {
  //   return this.storage.get('isLogin');
  // }
   // getProviderById(Da){
 //   let data = JSON.stringify(Object.assign(Da));
 //    return this.api.post('users.php?action=getProviderById', data);
 // }

}


