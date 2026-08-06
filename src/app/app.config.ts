import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura
      },
      license: 'eyJpZCI6IjRiMTFiM2E5LTkzMGUtNGUyMy04NWRmLWYwZWU1NDdjN2YxNSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODYwMTUyMTUsImV4cCI6MTgxNzU1MTIxNX0.hS-afeS0AFHYeGMCpXonCXb3R6vE3WLZOviWdvHYwGHlHp7N6LgIVMkU7ErXJ-XnSmj7Xi1GeZCmyiJTf72rDg'
    })
  ]
};
