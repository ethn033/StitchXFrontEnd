import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../models/orders/order-model';
import { OrderStatus } from '../enums/enums';

@Pipe({
  name: 'orderStatusString'
})
export class OrderStatusStringPipe implements PipeTransform {
transform(value: number): string {
    if (value === 0) return 'All';
    const statusName = OrderStatus[value];
    return statusName || 'Unknown';
  }

}
