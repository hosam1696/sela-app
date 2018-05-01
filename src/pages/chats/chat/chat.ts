import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { UserData } from '../../../providers/types/interface';
import { AppstorageProvider } from '../../../providers/appstorage/appstorage';
enum toggleMsgState{
  'active' = 'inactive',
  'inactive'= 'active'
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
export class ChatPage  implements AfterViewInit{
  @ViewChild(Content) chatContent: Content;
  @ViewChild('enteredMsg') enteredMsg: ElementRef;
  messages: any[] = [];
  state: string = 'inactive';
  contentHeight: number;
  fbChats: any;
  localUser: UserData;
  delegateUser: any;
  msgChanges: Observable<any>;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public appStorage: AppstorageProvider
  ) {
  }

  async ionViewDidLoad() {
    this.delegateUser = this.navParams.get('delegate');
    this.messages = [
      { content: 'first',state: 'active',type:'sender' },
      { content: 'second', state: 'active', type:'receiver' },
      { content: 'third', state: 'active', type: 'sender' },
      { content: 'forth', state: 'active', type: 'receiver' }
    ];
    this.localUser = await  this.appStorage.getUserData();
    let chatId = (()=>{
        let delegateId= this.delegateUser.id;
        let userId = this.localUser.id;
      return userId+'-'+delegateId
    })();
    this.fbChats = this.db.list(`/chats/${chatId}`);
    console.log('chat Id', chatId);
    this.msgChanges = this.db.list(`/chats/${chatId}`).valueChanges();

    this.msgChanges.subscribe(data=>{
      this.messages = data;
      this.messages = data.map(msg=>({...msg, state: 'active'}));
      this.chatContent.scrollToBottom(100);
      console.log('fb messages', this.messages);
    })

  }

  ngAfterViewInit() {
    this.chatContent.scrollToBottom();
  }
  ionViewWillLeave() {
    //this.msgChanges.unsubsribe()
  }

  sendMessage() {
    /*this.messages.push({ type:'sender',content: 'new content sdfsdfsd ds df shg agaj ga yhgu guyas guyas ' + Math.random(), state: 'inactive' });
    setTimeout(() => {
      this.toggleState();
    }, 100);*/
    this.fbChats.push({
      date: Date.now(),
      delegate_id: this.delegateUser.id,
      delegate_name: this.delegateUser.name,
      message: this.enteredMsg.nativeElement.value,
      user_id: this.localUser.id,
      user_name: this.localUser.name,
      state: 'inactive'
    }).then(()=> {
      this.chatContent.scrollToBottom(0);
    });
    console.log('entered value', this.enteredMsg.nativeElement.value);
    this.enteredMsg.nativeElement.value = '';
  }


  toggleState() {
    let message = this.messages[this.messages.length - 1];
    console.log(this.messages[this.messages.length - 1])
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
