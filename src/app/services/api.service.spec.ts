import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApiService } from './api.service';

describe('apiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#apiUserOrPassChange should return true', () => {
    service['token'] = undefined;

    spyOn<any>(service, 'authenticate');
    service['getToken']();

    expect(service['authenticate']).toHaveBeenCalled();
  });

  it('#getToken should not call #authenticate if token is defined', () => {
    service['token'] = of('123456');

    spyOn<any>(service, 'authenticate');
    service['getToken']();

    expect(service['authenticate']).not.toHaveBeenCalled();
  });
});
