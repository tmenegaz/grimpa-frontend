import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNgxMask } from 'ngx-mask';
import { provideToastr } from 'ngx-toastr';
import { AppComponent } from '~app/app.component';
import { appConfig } from '~app/app.config';
import { authInterceptor } from '~app/config/login/interceptors/auth.interceptor';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from './app/services/language.service';


export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
  }

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
      },
      provideNgxMask({
        validation: true,
        patterns: {
          '0': { pattern: new RegExp('\\d'), symbol: '0'
          } 
         }, 
         dropSpecialCharacters: false
      }),
      TranslateService,
      {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }).providers,
      LanguageService
    ]
  }
).catch((err) => console.error(err));
