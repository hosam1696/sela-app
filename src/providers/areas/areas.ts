
import { Injectable } from '@angular/core';
import {AppAPI} from "../api";

@Injectable()
export class AreasProvider {

  constructor(public api: AppAPI) {
  }
  getBrachType(type?: string) {
    return this.api.get(`allBranches/`)
  }
  getBranch(id:number) {
    return this.api.get(`branch/${id}`)
  }
  getNearestBranches(loc:[number, number]) {
    return this.api.get(`branch/nearest/lat/${loc[0]}/lng/${loc[1]}`)
  }
}
