import { Injectable } from '@angular/core';
import {AppAPI} from "../api";

@Injectable()
export class OrdersProvider {

  constructor(public api: AppAPI) {
  }

  getUserOrders(token: string) {
    return this.api.get('orders', {token})
  }

  getOrderById(id: number, token: string) {
    return this.api.get('orders/'+id, {token})
  }
}