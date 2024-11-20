import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AppComponent } from './app.component';
import { Settings, SettingService } from './services/settings.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let settingsService: SettingService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    settingsService = TestBed.inject(SettingService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#redirectToSettings should redirect if user details are missing', () => {
    const settingsData: Settings = {
      apiUser: '',
      apiPass: 'pass',
      facultyNumber: '12345678',
    };

    spyOn(settingsService, 'getValue').and.returnValue(settingsData);
    spyOn(router, 'navigate');

    component['redirectToSettings']();

    expect(router.navigate).toHaveBeenCalled();
  });

  it('#redirectToSettings should not redirect if user details are filled', () => {
    const settingsData: Settings = {
      apiUser: 'user',
      apiPass: 'pass',
      facultyNumber: '12345678',
    };

    spyOn(settingsService, 'getValue').and.returnValue(settingsData);
    spyOn(router, 'navigate');

    component['redirectToSettings']();

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
