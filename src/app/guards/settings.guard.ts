import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SettingService } from '../services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsGuard implements CanActivate {

  constructor(private readonly settingService: SettingService) { }

  public canActivate() {
    const { apiUser, apiPass, facultyNumber } = this.settingService.getValue();
    return apiUser != null && apiPass != null && facultyNumber != null;
  }
}
