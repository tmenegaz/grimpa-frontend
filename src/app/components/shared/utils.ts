import { Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '~src/app/config/login/service/auth.service';
import { Perfil } from '~src/app/enums/perfil.enum';
import { Roles } from '~src/app/enums/roles.enum';
import { RolesService } from '~src/app/services/roles.service';

export const currentDate = new Date()
  .toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

export function isAdmin(authService: AuthService): boolean {
  const roles = authService.getCurrentUserRoles();
  return roles ? roles.includes(Roles.ADMIN) : false;
}

export function isRoleAdmin(rolesService: RolesService): boolean {
  const roles = rolesService.getCurrentRoles();

  return roles.includes(Roles.ADMIN);
}

export function convertPerfisToNumbers(perfis: string[]): number[] {
  return perfis.map(perfil => Perfil[perfil as keyof typeof Perfil]);
}

export function setPerfisValue(tecnicoForm: FormGroup): void {
  const selectedPerfis: string[] = tecnicoForm.get('perfis').value;
  const perfilValues: number[] = convertPerfisToNumbers(selectedPerfis);
  tecnicoForm.get('perfis').setValue(
    perfilValues.length === 0
      ? Perfil.TECNICO as number
      : perfilValues
  );
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

export function translateInstant(key: string, translate: TranslateService): string {
  let value: string;
  translate.get(key).subscribe(
    (translation: string) => value = translation
  );
  return value;
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

