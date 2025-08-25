import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnderscores'
})
export class RemoveUnderscoresPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return typeof value === 'string' ? value.replace(/_/g, ' ') : value;
  }

}
