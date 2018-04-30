import { LatLng } from "../../providers/types/interface";

export class Place {
  public id: string | number;
  public title: string;
  public location: any|LatLng;
  public icon: string;
  public vicinity: string;
  public type: string;
  constructor(id,location, title, type, vicinity= '',rating=4) {
    Object.assign(this, {id,location,title, type, vicinity, rating});
    this.icon = `assets/imgs/${type}-pin.png`
  }

  public getPlaceInfo(location = this.location):any {

  }
}
