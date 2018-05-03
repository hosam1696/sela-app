import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';


@Injectable()
export class FcmProvider {

  constructor(
    public firebaseNative: Firebase,
    private platform: Platform
  ) {}

  async getToken() {

    let token;

    if (this.platform.is('android')) {

      token = await this.firebaseNative.getToken()
    }

    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      const perm = await this.firebaseNative.grantPermission();
    }

    // Is not cordova == web PWA
    if (!this.platform.is('cordova')) {
      // TODO add PWA support with angularfire2
    }

    // save token to DB
  }


  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }

}
