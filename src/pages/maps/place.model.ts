export class Place {
  public title: string;
  public loc: [number, number];
  public icon: string;
  constructor(loc, title, type) {
    Object.assign(this, {loc,title, type});
    this.icon = type === 'user'? 'assets/imgs/user-pin.png': 'assets/imgs/res-pin.png'
  }

  public getPlaceInfo(location: [number, number] = this.loc):any {

  }
}
