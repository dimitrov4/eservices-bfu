import { registerLocaleData } from '@angular/common';
import localeBg from '@angular/common/locales/bg';
import { LOCALE_ID } from '@angular/core';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app.routes';

registerLocaleData(localeBg);

export const appConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'bg-BG' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
};
