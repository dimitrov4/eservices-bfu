import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpHeaders, HttpResponse } from '@capacitor/core';
import { sha256 } from 'js-sha256';
import { from, map, Observable, switchMap } from 'rxjs';

import { Settings, SettingService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private token?: Observable<string>;
  private currSettings: Settings;
  private readonly url = `https://e-services.bfu.bg/api/`;

  constructor(private readonly settingsService: SettingService) {
    this.currSettings = this.settingsService.getValue();
  }

  public getToken(): Observable<string> {
    if (!this.token) {
      return this.authenticate(this.url);
    }

    const settings = this.settingsService.getValue();

    if (this.currSettings != settings) {
      this.currSettings = settings;
      return this.authenticate(this.url);
    };

    return this.token;
  }

  private authenticate(url: string): Observable<string> {
    const settings = this.settingsService.getValue();

    const data = new HttpParams()
      .set('user', settings.apiUser!)
      .set('pass', sha256(settings.apiPass!))
      .toString();

    const headers: HttpHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const opts = { url, data, headers };

    this.token = from(CapacitorHttp.post(opts))
      .pipe(
        map(resp => JSON.parse(resp.data)),
        map(data => data['token'])
      );

    return this.token;
  }

  public post(url: string): Observable<HttpResponse> {
    return this.getToken()
      .pipe(
        map(token => {
          const settings = this.settingsService.getValue();

          const data = new HttpParams()
            .set('fan', settings.facultyNumber!)
            .toString();

          const headers: HttpHeaders = {
            'Authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }

          return { url, data, headers };
        }),
        switchMap(opts => from(CapacitorHttp.post(opts)))
      )
    };
}
