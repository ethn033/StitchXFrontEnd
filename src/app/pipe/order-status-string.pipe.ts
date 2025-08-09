import { Pipe, PipeTransform } from '@angular/core';
import { EOrderStatus } from '../enums/enums';

@Pipe({
  name: 'orderStatusString'
})
export class OrderStatusStringPipe implements PipeTransform {
transform(value: number): string {
    if (value === 0) return 'All';
    const statusName = EOrderStatus[value];
    return statusName || 'Unknown';
  }

}
