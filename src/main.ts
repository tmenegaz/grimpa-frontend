import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const config = {
  disableAnimations: false
  };

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: BrowserAnimationsModule,
      useValue: BrowserAnimationsModule.withConfig(config), },
    appConfig.providers
  ]})
  .catch((err) => console.error(err));