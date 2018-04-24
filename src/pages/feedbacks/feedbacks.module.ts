import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbacksPage } from './feedbacks';
import {Ionic2RatingModule} from "ionic2-rating";
import {UsersProviders} from "../../providers/users";

@NgModule({
  declarations: [
    FeedbacksPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbacksPage),
    Ionic2RatingModule,
  ],
  providers: [
    UsersProviders
  ]
})
export class FeedbacksPageModule {}
