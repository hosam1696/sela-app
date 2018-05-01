import { Injectable } from '@angular/core';
import {AppAPI} from "../api";

@Injectable()

export class ChatProvider {
    constructor(public api:AppAPI) {

    }

    getuserchats(id, role) {

    }
}
