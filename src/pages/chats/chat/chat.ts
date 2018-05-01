import {Component, ViewChild, ElementRef, OnChanges} from '@angular/core';
import {IonicPage, NavController, NavParams, Content} from 'ionic-angular';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {UserData} from '../../../providers/types/interface';
import {AppstorageProvider} from '../../../providers/appstorage/appstorage';

enum toggleMsgState {
  'active' = 'inactive',
  'inactive' = 'active'
}

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  animations: [
    trigger('messageState', [
      state('inactive', style({
        transform: 'translateY(20px)'
      })),
      state('active', style({
        transform: 'translateX(0)'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      // transition('void => active', animate('200ms ease-in', style({transform: 'translateY(10px)'}))),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})
export class ChatPage implements OnChanges {
  @ViewChild(Content) chatContent: Content;
  @ViewChild('enteredMsg') enteredMsg: ElementRef;
  messages: any[] = [];
  state: string = 'inactive';
  contentHeight: number;
  fbChats: any;
  localUser: UserData;
  receiver: any;
  msgChanges: Observable<any>;
  firstLoad: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public db: AngularFireDatabase,
              public appStorage: AppstorageProvider
  ) {
  }

  async ionViewDidLoad() {
    this.receiver = this.navParams.get('receiver');
    this.messages = [
      {content: 'first', state: 'active', type: 'sender'},
      {content: 'second', state: 'active', type: 'receiver'},
      {content: 'third', state: 'active', type: 'sender'},
      {content: 'forth', state: 'active', type: 'receiver'}
    ];
    this.localUser = await  this.appStorage.getUserData();
    console.log('user', this.localUser, 'receiver', this.receiver);
    let chatId = (() => {
      let receiverId = this.receiver.id;
      let userId = this.localUser.id;
      return this.localUser.role == 'user' ? userId + '-' + receiverId : receiverId + '-' + userId
    })();
    this.fbChats = this.db.list(`/chats/${chatId}`);
    console.log('chat Id', chatId);
    this.msgChanges = this.db.list(`/chats/${chatId}`).valueChanges();

    this.msgChanges.subscribe(data => {
      this.messages = data;
      this.messages = data.map(msg => ({...msg, state: 'active'}));
      //Hack for scrolling to bottom
      if (this.chatContent && this.firstLoad) {
        setTimeout(() => {
          this.chatContent.scrollToBottom();
          //this.firstLoad = false;
        }, 0);

      }
    })

  }


  ionViewWillLeave() {
    //this.msgChanges.unsubsribe()
  }

  ngOnChanges(changes) {
    if (changes.messages.length) {
      //this.chatContent.scrollToBottom()
    }
  }

  sendMessage() {
    const msg = this.enteredMsg.nativeElement.value;
    if (msg && msg.trim()) {


      this.fbChats.push({
        date: Date.now(),
        delegate_id: this.localUser.role == 'user'?this.receiver.id:this.localUser.id,
        delegate_name: this.receiver.name,
        message: msg,
        user_id: this.localUser.role == 'user'?this.localUser.id:this.receiver.id,
        user_name: this.localUser.name,
        state: 'inactive',
        user_send_id: this.localUser.id
      }).then(() => {
        this.chatContent.scrollToBottom(0);
      });
      console.log('entered value', this.enteredMsg.nativeElement.value);
      this.enteredMsg.nativeElement.value = '';
      this.enteredMsg.nativeElement.style.height = 'auto';
    }
  }


  toggleState() {
    let message = this.messages[this.messages.length - 1];
    console.log(this.messages[this.messages.length - 1]);
    message.state = toggleMsgState[message.state];
  }

  watchHeight(event) {
    const textArea = this.enteredMsg.nativeElement;
    if (textArea.scrollHeight < 180) {
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  }

}
