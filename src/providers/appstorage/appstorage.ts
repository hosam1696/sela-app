
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {UserData} from "../types/interface";
import {UserStatus} from "../types/enums";

@Injectable()
export class AppstorageProvider {
  _TOKEN:string;
  _USER_DATA: UserData;
  localUserStatus: UserStatus;
  constructor(public storage: Storage) {
  }
  public async  saveToken(token: string): Promise<any> {
    this._TOKEN = await this.storage.set('TOKEN', token);
    //console.log(this._TOKEN);
    this.localUserStatus = UserStatus.loggedIn;
    return this.getToken();
  }

  public async saveUserData(userData: UserData):Promise<UserData> {
    this._USER_DATA = await this.storage.set('localUserInfo', userData);
    return this._USER_DATA
  }

  public async registerUserInStorage(userData: UserData) {
    let user = await this.saveUserData(userData);
    let userLogged = await this.userLogged(false);
    return user;
  }

  public async loginUserInStorage(userData: UserData, token: string) {
    let user = await this.saveUserData(userData);
    let userLogged = await this.userLogged(true);
    let userToken = await this.saveToken(token);
    return user;
  }
  public async getUserData():Promise<UserData> {
    return this._USER_DATA = await this.storage.get('localUserInfo')
  }

  public  getToken() {
    return this.storage.get('TOKEN');
  }

  public userLogged(userLogStatus: boolean) {
    return this.storage.set('userLogged', userLogStatus)
  }
  public get userLogStatus() {
    return this.storage.get('userLogged');
  }
  public saveLocation(location) {
    return this.storage.set('userLocation', location)
  }
  public clearEntries() {
    //TODO: Rest these values
    /*_TOKEN:string;
    _USER_DATA: UserData;
    localUserStatus: UserStatus;
    */
    return this.storage.clear()
  }

}
