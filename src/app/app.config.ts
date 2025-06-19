import { ApplicationConfig, inject, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { DOCUMENT } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    [provideExperimentalZonelessChangeDetection()],
    {
      provide: 'DOCUMENT_EVENT_MANAGER',
      useFactory: () => {
        const doc = inject(DOCUMENT);
        return {
          addEventListener: (type: string, listener: EventListener) => {
            doc.addEventListener(type, listener);
            return () => doc.removeEventListener(type, listener);
          },
        };
      },
    },
  ],
};
