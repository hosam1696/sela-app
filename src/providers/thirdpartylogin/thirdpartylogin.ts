
import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
@Injectable()
export class ThirdpartyloginProvider {

  constructor(private googlePlus: GooglePlus) {
  }

  googleLogin(cb?:any, errcb?:any) {
    this.googlePlus.login()
      .then(res=>{
        console.log(res);
        cb&&cb(res)
      })
      .catch(err=>{
        errcb&&errcb(err);
        console.warn(err);
      })

  }

  facebookLogin() {

  }
}
