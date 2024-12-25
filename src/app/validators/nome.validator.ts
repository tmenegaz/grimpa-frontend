import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noNumbersValidator(control: AbstractControl): ValidationErrors | null {
  const nome = control.value;
  if (!nome) {
    return null;
  }

  const hasNumbers = /\d/.test(nome);
  return hasNumbers ? { hasNumbers: true } : null;
}
