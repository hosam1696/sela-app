import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {AngularFireDatabase} from "angularfire2/database";
import {UserData} from "../../providers/types/interface";
import {last} from "lodash";

interface  Msg {
  date: number,
  delegate_id: number,
  delegate_name: string,
  message: string,
  state?: string,
  user_id: number,
  user_name: string,
  key?:string,
  user_send_id?:number
}

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  roomsKeys: string[];
  localUser: UserData;
  allChats:Msg[] = [];
  loader: boolean = true;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public appStorage: AppstorageProvider,
              public db: AngularFireDatabase,
  ) {
  }

  async ionViewDidLoad() {
    let chats = this.db.list('/chats');
    this.localUser = await this.appStorage.getUserData();

    chats.snapshotChanges().map((chatsList) => {
      return chatsList.map(action => ({key: action.payload.key, ...action.payload.val()}));
    }).subscribe(allKeys => {
      console.log('all keys', allKeys);
      this.roomsKeys = allKeys.map(chat => chat.key);
      console.log('chat keys', this.roomsKeys);
      this.filterChats(this.localUser.role, this.localUser.id)
    });

  }

  openChat(receiver) {
    this.navCtrl.push('ChatPage', {receiver})
  }

  filterChats(role, id) {
    let filteredKeys = this.roomsKeys.filter(key => {
      let [userId, delegateId] = key.split('-');
      return (role == 'user' && userId == id) || (role == 'branch' && delegateId == id)
    });
    console.log('filtered chats', filteredKeys);
    if (filteredKeys.length) {

    
    filteredKeys.forEach(key=>{
      this.db.list('/chats/'+key)
        .valueChanges().subscribe(d=>{
          const lastEntry = last(d);
        console.log('last entry',lastEntry);
        const foundedChat = this.allChats.find(chat=>chat.key == key);
        if (foundedChat) {
          this.allChats.splice(this.allChats.indexOf(foundedChat),1,foundedChat)
        } else {
          this.allChats.push({...last(d), key});
        }
        if (this.allChats.length>0) {
          this.loader = false;
        }
        console.log('All chats', this.allChats);
        }, err => {
          this.loader = false;
      });
    });
  } else {
    this.loader = false;
  }
  }

}
