import { Component } from "@angular/core";
import {
  Events,
  IonicPage, ModalController,
  NavController,
  NavParams
} from "ionic-angular";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PageMode, UserData } from "../../providers/types/interface";
import { AppstorageProvider } from "../../providers/appstorage/appstorage";
import { UsersProviders } from "../../providers/users";
import { AppUtilFunctions } from "../../providers/utilfuns";

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  profileEditForm: FormGroup;
  pageMode: PageMode = {
    editMode: false,
    editText: "EditProfile"
  };
  formMasks: any = {
    mobile: [/\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/]
  };
  localUser: UserData;
  token: string;
  defaultRating: number = 4;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public appStorage: AppstorageProvider,
    public events: Events,
    public userProvider: UsersProviders,
    public appUtils: AppUtilFunctions,
    public modalCtrl: ModalController
  ) {}

  async ionViewDidLoad() {
    this.profileEditForm = this.formBuilder.group({});

    [this.localUser, this.token] = await Promise.all([this.appStorage.getUserData(), this.appStorage.getToken()]);
  }

  private initiateEditForm() {
    this.profileEditForm = this.formBuilder.group({
      first_name: [this.localUser.first_name],
      last_name: [this.localUser.last_name],
      email: [this.localUser.email],
      address: [this.localUser.address],
      phone: [this.localUser.phone],
      vehicle: [this.localUser.vehicle]
    });
  }

  openPage(page: string) {
    this.navCtrl.push(page);
  }

  submitForm() {
    let editUserData = {
      ...this.profileEditForm.value,
      id: this.localUser.id,
      phone: this.profileEditForm.get("phone").value.replace(/\s/g, ""),
      token: this.token,
      name: this.concatWords('first_name', 'last_name')
    };

    this.userProvider.updateUserInfo(editUserData).subscribe(
      data => {
        let userData: UserData = data[0];
        console.log(status, userData);//TODO: remove this line
        if (data.status) {
          this.appUtils.AppToast("تم تعديل البيانات بنجاح");
          userData.token = this.localUser.token;
          this.appStorage.saveUserData(userData)
            .then((result) => {
              console.info('saveUserData Result', result);//TODO: remove this line
              this.localUser = result;
              this.pageMode.editMode = false;
              this.events.publish("refreshStorage");
            });
        }
      },
      err => {
        console.warn(err);
      }
    );
  }

  private concatWords(first: string = 'first_name', last: string= 'last_name'): string {
    return (
      this.profileEditForm.get(first).value + " " + this.profileEditForm.get(last).value
    );
  }

  public changePageMode(): boolean {
    if (!this.pageMode.editMode) {
      this.initiateEditForm();
    }
    return (this.pageMode.editMode = !this.pageMode.editMode);
  }

  public changeImage() {
    // do image upload
  }

  public logout(): void {
    this.events.publish('userLogout')
  }

  public openModal() {
    let modal = this.modalCtrl.create('FeedbacksPage', {localUser: this.localUser, token: this.token});
    modal.present()
  }
}
