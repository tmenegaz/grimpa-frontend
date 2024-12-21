import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideToastr } from 'ngx-toastr';

const config = {
  disableAnimations: false
  };

bootstrapApplication(AppComponent, {
  providers: [
      {
        provide: BrowserAnimationsModule,
        useValue: BrowserAnimationsModule.withConfig(config),
      },
      ...appConfig.providers, 
      provideAnimationsAsync(),
      provideToastr({
        timeOut: 4000,
        closeButton: true,
        progressBar: true
      })
    ]
  }
).catch((err) => console.error(err));
