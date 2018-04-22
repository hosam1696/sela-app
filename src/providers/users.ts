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
  userLogout(token) {
    return this.api.get('logout', {token})
  }
  userRegister(userData) {

    return this.api.post('register', userData);
  }
  userEdite(userData) {
    return this.api.post('edituser', userData);
  }

  contactAdmins(contactData: any, endpoint:string) {
    return this.api.post(endpoint, contactData)
  }

  getUserData(token: string) {
    return this.api.get('view-user', {token})
  }

  resetPassword(resetobj:any) {
    return this.api.post('resetPassword', resetobj)
  }

  updateUserInfo(userData:any) {
    let id = userData.id;
    delete userData.id;
    return this.api.post('editUser/'+id, userData)
  }

  setdeviceTokeId(Da){
  let data = JSON.stringify(Object.assign(Da));
    return this.api.post('users.php?action=setDeviceToken', data);
  }


}


