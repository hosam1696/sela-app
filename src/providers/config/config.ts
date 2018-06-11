
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigProvider {
  public defaultLang: string = 'ar';
  public preferences: any = {};
  defaultPreferences = {
    language: 'ar',
    showAzkarIcon: false,
    partsNumber: 1,
    prayNotifications: false
  }
  constructor(public storage: Storage, public http: HttpClient) {
    this.getPreferences().then(pref => this.preferences = pref);
  }
 

  async getPreferences() {
    return this.getStoredPreferences()
      .then(pref => {
        pref = pref || {};
        return this.preferences = { ...this.defaultPreferences, ...pref };
      });
  }
  private getStoredPreferences() {
    return this.storage.get('user:preferences');
  }

  public async setPreferences(prop, value) {
    let preferences = await this.getPreferences();
    return this.storage.set('user:preferences', { ...preferences, ...{ [prop]: value } });
  }




  public changeLang(lang) {
    this.setPreferences('language', lang)
      .then(pre=>{
        console.log('user preferences', pre);
      })
    return this.storage.set('app:lang', lang)
  }
  
  public getAppLang() {
    return this.storage.get('app:lang')
  }

}
