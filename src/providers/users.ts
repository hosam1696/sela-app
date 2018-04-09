import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { MyVariabels } from "./variables";
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { Network } from '@ionic-native/network';

@Injectable()
export class UsersProviders {
  userInfo: any;

  constructor(
    public http: HttpClient,
    public events: Events,
    public storage: Storage,
    public Vari: MyVariabels,
    // private network: Network
  ) {
  }
   userLogin(userData){
    let data = JSON.stringify(Object.assign(userData));
    return this.http.post<any>(this.Vari.API_URL+'users.php?action=loginUser', data);
  }
  userRegister(userData) {
    let data = JSON.stringify(Object.assign(userData));
    return this.http.post<any>(this.Vari.API_URL+'users.php?action=newUser',data);
  }
  userEdite(userData) {
        let data = JSON.stringify(Object.assign(userData));
    return this.http.post<any>(this.Vari.API_URL+'users.php?action=editUser', data);
  }
  getPlacesByPerantId(d) {
    //let data = JSON.stringify({uid});
    let data = JSON.stringify(Object.assign(d));
    // console.log('Data entered', data, typeof data);
    // console.log('this.Vari.API_URL', this.Vari.API_URL);
    return this.http.post<any>(this.Vari.API_URL+'users.php?action=getPlaces', data);
  }
  forgetPassword(d) {
    //let data = JSON.stringify({uid});
    let data = JSON.stringify(Object.assign(d));
    // console.log('Data entered', data, typeof data);
    // console.log('this.Vari.API_URL', this.Vari.API_URL);
    return this.http.post<any>(this.Vari.API_URL+'users.php?action=forgetPassword', data);
  }

  getUserInfo() {
    if (localStorage.getItem('localUserInfo')) {
     
     return JSON.parse(localStorage.getItem('localUserInfo'));

    }
    else{
      return false;
    }
    
  }
  setdeviceTokeId(Da){
  let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'users.php?action=setDeviceToken', data);
  }
  // getToken() {
  //   return this.storage.get('userToken');
  // }
  // isUserLogin() {
  //   return this.storage.get('isLogin');
  // }
   // getProviderById(Da){
 //   let data = JSON.stringify(Object.assign(Da));
 //    return this.http.post<any>(this.Vari.API_URL+'users.php?action=getProviderById', data);
 // }
 
 
 getPage(Da) {
        let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'pages.php?action=showPage', data);
  }

  checkRating(Da){
   let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'users.php?action=checkRating', data);
 }
 upDateRating(Da){
  let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'users.php?action=upDateRating', data);
 }
 addRating(Da){
  let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'users.php?action=addRating', data);
 }
 getRatingAndWorks(Da){
    let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'users.php?action=getRatingAndWorks', data);
 }
  getPageByPageName(Da){
    let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'pages.php?action=getPageByPageName', data);
 }
  contactMessage(Da){
    let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'mails.php?action=contactUsMessage', data);
 }
   recommendedWorkers(Da){
     console.log('Da',Da);
    let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'mails.php?action=recommendedWorkers', data);
 }
 
 getSocialMediaLinksAndNotifyNum(Da){
    let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'pages.php?action=getSocialMediaLinksAndNotifyNum', data);
 }
 getNotification(Da){
    let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'notifications.php?action=getNotifications', data);
 }
  getNotificationDetails(Da){
    let data = JSON.stringify(Object.assign(Da));
    return this.http.post<any>(this.Vari.API_URL+'notifications.php?action=getNotificationDetails', data);
 }
 
  setClickPhone(Da){
    let data = JSON.stringify(Object.assign(Da));
    console.log('data',data)
    return this.http.post<any>(this.Vari.API_URL+'users.php?action=setClickPhone', data);
 }
 
 
}


