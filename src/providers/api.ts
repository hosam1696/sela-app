import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";

@Injectable()

export class AppAPI {
    public API_URL: string = 'http://app-sila.com/api/';
    public URL: string = 'http://app-sila.com/';
    constructor(public http: HttpClient, private translate: TranslateService) {
    }

    get(endpoint: string, params?: any) {
        let httpParams: HttpParams = new HttpParams({});
        if (params) {
            for (let param in params) {
                httpParams = httpParams.set(param, params[param])
            }
        }
        return this.http.get<any>(this.API_URL + endpoint, {params: httpParams, headers: new HttpHeaders().set('x-localization', this.translate.currentLang)
    })
    }

    post(endpoint: string, body?: any, params?: any, headers?: any) {
        let httpParams: HttpParams = new HttpParams({});
        let httpHeaders: HttpHeaders = new HttpHeaders({}).append('Access-Control-Allow-Origin', '*');
        httpHeaders.append('x-localization', this.translate.currentLang);
        if (params) {
            for (let param in params) {
                if (params.hasOwnProperty(param)) {
                    httpParams = httpParams.set(param, params[param])
                }
            }
        }
        if (httpHeaders) {
            for (let header in headers) {
                if (headers.hasOwnProperty(header)) {
                    httpHeaders = httpHeaders.set(header, headers[header])
                }
            }
        }
        return this.http.post<any>(this.API_URL + endpoint, body, {params: httpParams, headers: httpHeaders})
    }

    getAddress(latitude, longitude) { 
        let geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&key=AIzaSyBQMQ8iGHbNyH6TlL7-gc8TJRNpURF0fWg';
        return this.http.get(geocodeUrl)
    }
}
