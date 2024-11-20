import { TestBed } from '@angular/core/testing';

import { SettingService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingService);

    let mockStorage: any = {};

    spyOn(window.localStorage, 'getItem').and.callFake((key) => {
      return key in mockStorage ? mockStorage[key] : null;
    });

    spyOn(window.localStorage, 'setItem').and.callFake((key, value) => {
      mockStorage[key] = value.toString();
    });

    spyOn(window.localStorage, 'clear').and.callFake(() => {
      mockStorage = {};
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setValue should set settings', () => {
    const settings = {
      apiUser: 'user',
      apiPass: 'pass',
      facultyNumber: 'number',
    };

    const expected = {
      apiUser: 'user',
      apiPass: 'pass',
      facultyNumber: 'number',
    }

    localStorage.clear();
    service.setValue(settings);
    const res = service.getValue();

    expect(res).toEqual(expected);
  });

  it('#load should load previous settings from localStorage', () => {
    const expected = {
      apiUser: 'user',
      apiPass: 'pass',
      facultyNumber: null,
    }

    localStorage.clear();
    localStorage.setItem('apiUser', 'user');
    localStorage.setItem('apiPass', 'pass');
    const res = service['load']();

    expect(res).toEqual(expected);
  });

  it('#persist should save settings to localStorage', () => {
    const settings = {
      apiUser: 'user',
      apiPass: 'pass',
      facultyNumber: null,
    };

    const expected = {
      apiUser: 'user',
      apiPass: 'pass',
      facultyNumber: null,
    }

    service['persist'](settings);
    const res = service['load']();

    expect(res).toEqual(expected);
  });
});
