import { TestBed } from '@angular/core/testing';

import { SettingsGuard } from './settings.guard';
import { SettingService } from '../services/settings.service';

describe('SettingsGuard', () => {
  let guard: SettingsGuard;
  let settingService: SettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SettingsGuard)
    settingService = TestBed.inject(SettingService)
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('#canActivate should return false if not all user details are available', () => {
    const settings = {
      apiUser: null,
      apiPass: 'pass',
      facultyNumber: '1234'
    }
    spyOn(settingService, 'getValue').and.returnValue(settings);

    const res = guard.canActivate();

    expect(res).toBeFalse();
  });

  it('#canActivate should return true if all user details are available', () => {
    const settings = {
      apiUser: 'user',
      apiPass: 'pass',
      facultyNumber: '1234'
    }
    spyOn(settingService, 'getValue').and.returnValue(settings);

    const res = guard.canActivate();

    expect(res).toBeTrue();
  });
});
