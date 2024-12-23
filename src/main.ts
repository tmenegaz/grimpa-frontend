import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { AppComponent } from '~app/app.component';
import { appConfig } from '~app/app.config';
import { authInterceptor } from '~app/config/login/interceptors/auth.interceptor';

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
      }),
      provideHttpClient(),
      {
        provide: HTTP_INTERCEPTORS,
        useValue: authInterceptor,
        multi: true
      }
    ]
  }
).catch((err) => console.error(err));
