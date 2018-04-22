export class Place {
  public title: string;
  public loc: [number, number];
  public icon: string;
  public vicinity: string;
  public type: string;
  constructor(loc, title, type, vicinity= '') {
    Object.assign(this, {loc,title, type, vicinity});
    this.icon = type === 'user'? 'assets/imgs/user-pin.png': 'assets/imgs/res-pin.png'
  }

  public getPlaceInfo(location: [number, number] = this.loc):any {

  }
}
