import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

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
          backgroundColor: '#eee',
          transform: 'scale(1)'
        })),
        state('active', style({
          backgroundColor: '#cfd8dc',
          transform: 'scale(1.1)'
        })),
        transition('inactive => active', animate('100ms ease-in')),
        transition('active => inactive', animate('100ms ease-out'))
      ])
    ]
})
export class ChatPage {
  messages: any[] = [];
  state: string = 'inactive';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.messages = [
      { content: 'first' },
      {content: 'second'}
    ]
  }

  sendMessage() {
    this.toggleState();
  }


  toggleState() {
    this.state = toggleMsgState[this.state];
  }

}
