import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
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
          transform: 'translateX(120%)'
        })),
        state('active', style({
          transform: 'translateX(0)'
        })),
        transition('inactive => active', animate('200ms ease-in')),
        transition('active => inactive', animate('100ms ease-out'))
      ])
    ]
})
export class ChatPage implements OnInit, AfterViewInit {
  @ViewChild('chatList') chatList: ElementRef;
  @ViewChild(Content) chatContent: Content;
  @ViewChild('enteredMsg') enteredMsg: ElementRef;
  messages: any[] = [];
  state: string = 'inactive';
  contentHeight: number;
  firebaseMsgs: Observable<any[]>;
  fbChats: any;
  localUser: UserData;
  delegateUser: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public appStorage: AppstorageProvider
  ) {
  }

  async ionViewDidLoad() {
    this.messages = [
      { content: 'first',state: 'active',type:'sender' },
      { content: 'second', state: 'active', type:'receiver' },
      { content: 'third', state: 'active', type: 'sender' },
      { content: 'forth', state: 'active', type: 'receiver' }
    ];
    this.delegateUser = this.navParams.get('delegate');
    this.localUser = await this.appStorage.getUserData();
    console.log(this.db.list('/chats'));
    this.fbChats = this.db.list('/chats');
    this.firebaseMsgs = this.db.list('/chats').valueChanges();
    let messages = this.db.list('/18/data');
    let users = this.db.list('/28');
    console.log(users.query, messages.query, this.fbChats.query);
  }
  ngOnInit() {
    
  }
  ngAfterViewInit() {
    console.log(this.chatList.nativeElement.scrollHeight, this.chatList.nativeElement);
    this.contentHeight = this.chatContent.contentHeight;
    console.log(this.contentHeight, this.chatContent.scrollHeight);

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
      user_name: this.localUser.name
    });
    console.log('entered value', this.enteredMsg.nativeElement.value);
    this.enteredMsg.nativeElement.value = '';
    this.chatContent.scrollTo(0, this.chatList.nativeElement.scrollHeight - this.contentHeight)
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
