import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { Push } from '@ionic-native/push';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import {FilePath} from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {FormsModule} from "@angular/forms";
import {HttpClient,HttpClientModule} from "@angular/common/http";
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppUtilFunctions} from '../providers/utilfuns';
import {MyVariabels} from'../providers/variables';
import { Geolocation} from '@ionic-native/geolocation';
import { AppAPI } from '../providers/api';
import { AppstorageProvider } from '../providers/appstorage/appstorage';
import { AreasProvider } from '../providers/areas/areas';
import { OrdersProvider } from '../providers/orders/orders';
import {UsersProviders} from "../providers/users";

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
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    File,
    FileTransfer,
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
    OrdersProvider
  ]
})
export class AppModule {}
