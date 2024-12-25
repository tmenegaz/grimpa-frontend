import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private languageSubject = new BehaviorSubject<string>(this.getSavedLanguage() || 'pt');
  language$ = this.languageSubject.asObservable();

  constructor(private translate: TranslateService) {
    const savedLanguage = this.getSavedLanguage();
    if (savedLanguage) {
      this.translate.use(savedLanguage);
    } else {
      this.translate.setDefaultLang(this.getSavedLanguage() || 'pt');
    }
  }
  
  setLanguage(lang: string): void {
    this.translate.use(lang);
    this.languageSubject.next(lang);
    localStorage.setItem('language', lang);
  }
  
  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }
  
  getSavedLanguage(): string {
    return localStorage.getItem('language');
  }
}
