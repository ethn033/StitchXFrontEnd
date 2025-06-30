import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excludeFirstItem'
})
export class ExcludeFirstItemPipe implements PipeTransform {

  transform(items: any[]): any[] {
    if (!items || items.length <= 1) return [];
    return items.slice(1); // Returns array without first element
  }

}
