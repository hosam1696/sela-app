import {NgModule} from "@angular/core";
import {IonicModule, IonicPageModule} from "ionic-angular";
import {SellaSelectComponent} from "./sella-select";


@NgModule({
  imports: [
    IonicModule,
    IonicPageModule.forChild(SellaSelectComponent)
  ],
  declarations:[SellaSelectComponent],
  exports:[SellaSelectComponent]
})

export  class SellaSelectModule{}
