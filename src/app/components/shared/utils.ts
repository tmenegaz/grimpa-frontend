import { Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '~src/app/config/login/service/auth.service';
import { Perfil } from '~src/app/enums/perfil.enum';

export const currentDate = new Date()
.toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

export function isAdmin(authService: AuthService): boolean { 
  const perfil = authService.getCurrentUserProfile();
  
  const perfis = Object.keys(Perfil).filter(key => isNaN(Number(key)) 
  && Perfil[key as keyof typeof Perfil] !== Perfil.CLIENTE
);
return perfil?.toString() == perfis[0];
  // return perfil === Perfil.ADMIN;
}

export function isString(value: any): boolean {
  return typeof value === 'string' || value instanceof String;
}

export function isArray(value: any): boolean {
  return Array.isArray(value);
}

export function translateProfiles(profiles: any, translate: TranslateService): string[] {
  if (isString(profiles)) {
    return profiles.split(',').map(profile => translate.instant(profile.trim()));
  } else if (isArray(profiles)) {
    return profiles.map(profile => translate.instant(profile.trim()));
  }
  return [];
}

export function formatProfiles(profiles: string[]): string {
  return profiles.join(', ');
}

export function setElementStyle(renderer: Renderer2, element: HTMLElement, style: string, value: string): void {
  renderer.setStyle(element, style, value);
}

export function addClass(renderer: Renderer2, element: HTMLElement, className: string): void {
  renderer.addClass(element, className);
}

export function removeClass(renderer: Renderer2, element: HTMLElement, className: string): void {
  renderer.removeClass(element, className);
}

export function toggleClassBasedOnVisibility(renderer: Renderer2, element: HTMLElement, className: string, condition: boolean): void {
  if (condition) {
    addClass(renderer, element, className);
  } else {
    removeClass(renderer, element, className);
  }
}

