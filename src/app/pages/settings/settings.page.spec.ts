import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingService } from '../../services/settings.service';
import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let settingsService: SettingService;

  beforeEach(async () => {
    fixture = TestBed.createComponent(SettingsPage);
    settingsService = TestBed.inject(SettingService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false when validating an empty apiUser', () => {
    const form = component.settingsForm;
    const apiUserControl = form.get('apiUser');

    apiUserControl?.setValue('');
    expect(apiUserControl?.valid).toBeFalse();
  });

  it('should return true when validating a non-empty apiUser', () => {
    const form = component.settingsForm;
    const apiUserControl = form.get('apiUser');

    apiUserControl?.setValue('user');
    expect(apiUserControl?.valid).toBeTrue();

    apiUserControl?.setValue('user123');
    expect(apiUserControl?.valid).toBeTrue();
  });

  it('should return false when validating an empty apiPass', () => {
    const form = component.settingsForm;
    const apiPassControl = form.get('apiPass');

    apiPassControl?.setValue('');
    expect(apiPassControl?.valid).toBeFalse();
 });

  it('should return true when validating a non-empty apiPass', () => {
    const form = component.settingsForm;
    const apiPassControl = form.get('apiPass');

    apiPassControl?.setValue('123456');
    expect(apiPassControl?.valid).toBeTrue();

    apiPassControl?.setValue('123456abc');
    expect(apiPassControl?.valid).toBeTrue();
  });

  it('should return true when validating an existing apiPass', () => {
    const settings = {
      apiUser: null,
      apiPass: 'pass',
      facultyNumber: null
    }

    spyOn(settingsService, 'getValue').and.returnValue(settings);
    const form = component.settingsForm;
    const apiPassControl = form.get('apiPass');
    apiPassControl?.setValue('');

    expect(apiPassControl?.valid).toBeTrue();
  });

  it('should return false when validating a facultyNumber with less or more than 8 digits', () => {
    const form = component.settingsForm;
    const facultyNumberControl = form.get('facultyNumber');

    facultyNumberControl?.setValue('');
    expect(facultyNumberControl?.valid).toBeFalse();

    facultyNumberControl?.setValue('1234');
    expect(facultyNumberControl?.valid).toBeFalse();

    facultyNumberControl?.setValue('12345678910');
    expect(facultyNumberControl?.valid).toBeFalse();
  });

  it('should return true when validating a facultyNumber with 8 digits', () => {
    const form = component.settingsForm;
    const facultyNumberControl = form.get('facultyNumber');

    facultyNumberControl?.setValue('12345678');
    expect(facultyNumberControl?.valid).toBeTrue();
  });

  it('should call settings service on submit', () => {
    spyOn(settingsService, 'setValue');

    component.onSubmit();

    expect(settingsService.setValue).toHaveBeenCalled();
  });
});
