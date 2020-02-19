import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandconvertor'
})
export class ThousandconvertorPipe implements PipeTransform {

  transform(val: number): string {
    return this.convertNumber(val);
  }
  convertNumber(val: number): string {
    let returnKVal = '0';
    if (val && val < 1000) {
        returnKVal = '' + val;
    } else if (val >= 1000) {
        const kVal = val   / 1000;
        returnKVal = parseInt((''   + kVal), 10) + 'k';
    }
    return returnKVal;
  }
}
