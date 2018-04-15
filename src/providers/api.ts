import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
type mylimit = 'x' | 'y'
@Injectable()

export class AppAPI {
    public API_URL: string = 'http://selah.methaq.net.sa/api/';
    public URL: string = 'http://selah.methaq.net.sa/';
    constructor(public http: HttpClient) {
    }

    get(endpoint: string, params?: any) {
        let httpParams: HttpParams = new HttpParams({});
        if (params) {
            for (let param in params) {
                httpParams = httpParams.set(param, params[param])
            }
        }

        return this.http.get<any>(this.API_URL + endpoint, {params: httpParams})
    }

    post(endpoint: string, params?: any, headers?: any, body?: any) {
        let httpParams: HttpParams = new HttpParams({});
        let httpHeaders: HttpHeaders = new HttpHeaders({});
        if (params) {
            for (let param in params) {
                httpParams = httpParams.set(param, params[param])
            }
        }
        if (httpHeaders) {
            for (let header in headers) {
                httpHeaders = httpHeaders.set(header, headers[header])
            }
        }
        return this.http.post<any>(this.API_URL + endpoint, body, {params: httpParams, headers: httpHeaders})
    }
}
