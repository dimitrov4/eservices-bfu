import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService implements OnDestroy {

  private readonly settings: BehaviorSubject<Settings> = new BehaviorSubject(this.load());
  private readonly subscription$?: Subscription;

  constructor() {
    this.subscription$ = this.settings.subscribe(this.persist);
  }

  public ngOnDestroy(): void {
    this.subscription$!.unsubscribe();
  }

  public getObservable(): Observable<Settings> {
    return this.settings.asObservable();
  }

  public getValue(): Settings {
    return this.settings.getValue();
  }

  public setValue(settings: Settings): void {
    const { apiPass: oldApiPass, ...rest } = settings;

    let apiPass = oldApiPass;
    if (apiPass === '') {
      apiPass = this.settings.getValue().apiPass;
    }

    this.settings.next({
      apiPass,
      ...rest
    });
  }

  private load(): Settings {
    return {
      apiUser: localStorage.getItem('apiUser'),
      apiPass: localStorage.getItem('apiPass'),
      facultyNumber: localStorage.getItem('facultyNumber'),
    };
  }

  private persist(settings: Settings): void {
    if (settings.apiUser) localStorage.setItem('apiUser', settings.apiUser);
    if (settings.apiPass) localStorage.setItem('apiPass', settings.apiPass);
    if (settings.facultyNumber) localStorage.setItem('facultyNumber', settings.facultyNumber);
  }
}

export type Settings = {
  apiUser: string | null;
  apiPass: string | null;
  facultyNumber: string | null;
}
