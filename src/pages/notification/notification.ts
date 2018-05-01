import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/types/interface';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UsersProviders } from '../../providers/users';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  localUser: UserData;
  notificationId: number;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appStorage: AppstorageProvider,
    public userProvider: UsersProviders
  ) {
  }

  async ionViewDidLoad() {
    this.notificationId = this.navParams.get('id');
    this.localUser = await this.appStorage.getUserData();
  }

  getNotification(notificationId: number) {
    this.userProvider.showNotification(notificationId)
      .subscribe(data => {
        console.log('show notification data', data)
      })
  }

}
