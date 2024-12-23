import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordMask',
  standalone: true
})
export class PasswordMaskPipe implements PipeTransform {
  transform(value: string): string {
    return value ? '*'.repeat(10) : '';
  }
}
