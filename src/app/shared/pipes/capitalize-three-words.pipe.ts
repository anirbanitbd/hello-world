import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeThreeWords',
  standalone: true
})
export class CapitalizeThreeWordsPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value) {
      return '';
    }
    const stringWithoutSpaces = value.replace(/\s/g, '');
    const capitalizedWords = stringWithoutSpaces.slice(0, 3)
    return capitalizedWords.toUpperCase()
  }
}
