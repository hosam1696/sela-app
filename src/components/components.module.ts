import { NgModule } from '@angular/core';
import { SellaSelectComponent } from './sella-select/sella-select';
import {SellaSelectModule} from "./sella-select/sella-select.module";
@NgModule({
	declarations: [],
	imports: [SellaSelectModule],
	exports: [SellaSelectComponent]
})
export class ComponentsModule {}
