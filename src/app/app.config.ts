import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptorInterceptor } from './interceptors/api-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([apiInterceptorInterceptor])),
    providePrimeNG({
      ripple: true,
        theme: {
            preset: Aura,
            options: {
              darkModeSelector: false || 'none'
            }
        }
    }),
    provideZoneChangeDetection({ 
      eventCoalescing: true,
      runCoalescing: true
    }), 
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
    // Add any other global providers here
  ],
};
