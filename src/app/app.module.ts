import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { Push } from '@ionic-native/push';
import {FilePath} from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {FormsModule} from "@angular/forms";
import {HttpClient,HttpClientModule} from "@angular/common/http";
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AppUtilFunctions} from '../providers/utilfuns';
import { MyVariabels} from'../providers/variables';
import { Geolocation} from '@ionic-native/geolocation';
import { AppAPI } from '../providers/api';
import { AppstorageProvider } from '../providers/appstorage/appstorage';
import { AreasProvider } from '../providers/areas/areas';
import { OrdersProvider } from '../providers/orders/orders';
import {UsersProviders} from "../providers/users";
import {Firebase} from "@ionic-native/firebase";
import {FcmProvider} from "../providers/fcm/fcm.provider";
import {AngularFirestoreModule} from "angularfire2/firestore";
import {AngularFireModule, FirebaseAppConfig} from "angularfire2";
import { ThirdpartyloginProvider } from '../providers/thirdpartylogin/thirdpartylogin';
import { ConfigProvider } from '../providers/config/config';
import {GooglePlus} from '@ionic-native/google-plus';

const firebaseinit:FirebaseAppConfig = {
  apiKey: 'AIzaSyB81z_X21CPaxUprsoJdDtds71yhhwfE9w',
  projectId: 'sellah-82474',
  databaseURL: 'https://sellah-82474.firebaseio.com/'
};
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp,{
      scrollAssist: false,
      autoFocusAssist: false,
      backButtonText: ''
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(firebaseinit)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    File,
    FilePath,
    StatusBar,
    Push,
    Camera,
    SplashScreen,
    AppUtilFunctions,
    MyVariabels,
    Geolocation,
    AppAPI,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AppstorageProvider,
    UsersProviders,
    AreasProvider,
    OrdersProvider,
    Firebase,
    FcmProvider,
    ConfigProvider,
    GooglePlus,
    ThirdpartyloginProvider
  ]
})
export class AppModule {}
