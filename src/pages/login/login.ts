import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ViewController,
  NavParams,
  Events,
  AlertController
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsersProviders } from "../../providers/users";
import { AppUtilFunctions } from "../../providers/utilfuns";
import { AppstorageProvider } from "../../providers/appstorage/appstorage";
import {UserData} from "../../providers/types/interface";
import { UserHome } from "../../providers/types/enums";
import { TranslateService } from "../../../node_modules/@ngx-translate/core";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  loginForm: FormGroup;
  loader: boolean = false;
  openAsPage;
  boolean = false;
  constructor(
    private appStorage: AppstorageProvider,
    public appUtils: AppUtilFunctions,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public usersproviders: UsersProviders,
    public viewCtrl: ViewController,
    public events: Events,
    navParams: NavParams,
    public translate: TranslateService,
    private alertCtrl: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      emailorphone: ["", Validators.required],
      password: ["", Validators.required],
      saveLogin: [false]
    });
    this.openAsPage = navParams.get("openAsPage");
  }

  closePage() {
    this.viewCtrl.dismiss();
  }

  goSignup() {
    this.navCtrl.push("SignupPage");
  }

  toForgotPass() {
    this.navCtrl.push("ResetpasswordPage");
  }
  goHomePage() {
    this.navCtrl.push("HomePage");
  }
  onSubmit() {
    console.log(this.loginForm.get('saveLogin').value);
    if (this.loginForm.controls.emailorphone.hasError("required")) {
      this.appUtils.appToast("يرجى ادخال برديك الالكترونى أو رقم الهاتف");
    } else if (this.loginForm.controls.password.hasError("required")) {
      this.appUtils.appToast("الرجاء إدخال  كلمة المرور");
    } else {
      const saveLogin = this.loginForm.get('saveLogin').value;
      const loginData: any = {};
      let emailOrPhoneVal = this.loginForm.get('emailorphone').value;
      this.loader = true;
      if (/^\d+$/.test(emailOrPhoneVal)) {
        loginData.phone = emailOrPhoneVal;
      } else {
        loginData.email = emailOrPhoneVal;
      }
      loginData.password = this.loginForm.get('password').value;
      this.usersproviders.userLogin(loginData).subscribe(
        res => {
          if (res.error) {
            this.appUtils.appToast("البيانات غير متطابقة");
          } else {
            console.log(res); // TODO: DEV Only reminder to be removed
            let self = this;
            saveLogin&&this.appStorage.saveToken(res.token);
            this.appUtils.appToast(this.translate.instant('تم الدخول بنجاح. التحويل للصفحة الرئيسية'), {position: 'top'});
            this.usersproviders.getUserData(res.token).subscribe((data:UserData|any) => {
              console.log('get user data from view user',data); // TODO: DEV Only reminder to be removed
              self.loader = false;
              if (data.id) {
                this.appStorage.loginUserInStorage({...data, saveLogin}, res.token).then(() => {
                  this.events.publish("refreshStorage");
                  this.events.publish("changeRoot", UserHome[data.role]);
                });
              }
            },()=>{
              this.loader = false;
            });
          }
        },
        err => {
          if (err.error instanceof ErrorEvent) {
            console.info(
              "%c%s%c%s",
              "font-weight: bold;color:red;font-size:14px",
              "Hosam",
              "color: #333",
              "  it's your fault check your code",
              err
            );
          } else {
            console.error(
              `Backend returned code ${err.status}, ` +
                `body was: ${err.error.body}`
            );
            this.loader = false;
            this.appUtils.appToast(" خطأ فى السيرفر الرجاء المحاولة مرة أخرى");
          }
        }, () => {
          this.loader = false;
        }
      );
    }
  }

  overall() {

  }

  selectLang() {
    let radioAlert = this.alertCtrl.create({
      mode:'ios',
      title: this.translate.instant('choose Language'),
      inputs : [
        {
            type:'radio',
            label:'العربية',
            value:'ar'
        },
        {
            type:'radio',
            label:'English',
            value:'en'
        }],
        buttons : [
          {
              text: this.translate.instant('Cancel'),
              handler: data => {
              console.log("cancel clicked");
              }
          },
          {
              text: this.translate.instant('Choose'),
              handler: lang => {
              console.log("selected Language", lang);
              this.events.publish('changeLang', lang);
              this.translate.setDefaultLang(lang)
              }
          }]
    });

    radioAlert.present();

  }
}
