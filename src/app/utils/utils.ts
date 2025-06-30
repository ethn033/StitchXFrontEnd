import { Order } from './../models/orders/order-model';
import { DropDownItem } from "../contracts/dropdown-item";

export function dateFilterValues() : DropDownItem[] {
    return [
        { id: 1, value: 'This Week' },
        { id: 3, value: 'This Month' },
        { id: 4, value: 'Last Month' },
        { id: 5, value: 'This Year' },
        { id: 6, value: 'Last Year' },
        { id: 7, value: 'Custom Range' },
        { id: 8, value: 'All Time' }
    ];
}

export function customerStatusValues(): DropDownItem[] {
    return [
        { id: 3, value: 'All' },
        { id: 1, value: 'Active' },
        { id: 2, value: 'Inactive' }
    ];
}













// *********************Dummy Data Generation*********************
export function generateDummyOrders() : Order[] {
    const dummyOrders: Order[] = [
          {
            orderId: 'ORD-1001',
            orderDate: new Date('2023-05-15'),
            deliveryDate: new Date('2023-06-10'),
            fabricDetails: 'Premium Cotton',
            stichingFit: 'Slim fit',
            fabricColor: 'Navy Blue',
            quantity: 2,
            price: 120.00,
            amountPaid: 60.00,
            amountRemaining: 60.00,
            paymentMethod: 'Card',
            paymentStatus: 'Partially Paid',
            deliveryMethod: 'Delivery',
            deliveryAddress: '123 Main St, Accra',
            deliveryStatus: 'Pending',
            buckramType: 'original',
            status: 2, // Ordered
            notes: 'Need by anniversary date',
            lastUpdated: new Date('2023-05-16'),
            customerId: 'CUST-001',
            garmentTypeId: 'GT-101',
            isActive: true, 
            isDeleted: false, 
            createdAtDateTime : new Date(), 
            updatedAtDateTime: new Date()
          },
          {
            orderId: 'ORD-1002',
            orderDate: new Date('2023-05-20'),
            deliveryDate: new Date('2023-06-05'),
            fabricDetails: 'Linen Blend',
            stichingFit: 'Regular fit',
            fabricColor: 'Charcoal Gray',
            quantity: 1,
            price: 85.00,
            amountPaid: 85.00,
            amountRemaining: 0.00,
            paymentMethod: 'Mobile Money',
            paymentStatus: 'Paid',
            deliveryMethod: 'Pickup',
            deliveryAddress: '',
            deliveryStatus: 'In Progress',
            buckramType: 'normal',
            status: 3, // Processing
            lastUpdated: new Date('2023-05-22'),
            completedDate: null,
            customerId: 'CUST-002',
            garmentTypeId: 'GT-102',
            isActive: true, 
            isDeleted: false, 
            createdAtDateTime : new Date(), 
            updatedAtDateTime: new Date()
          },
          {
            orderId: 'ORD-1003',
            orderDate: new Date('2023-05-01'),
            deliveryDate: new Date('2023-05-25'),
            fabricDetails: 'Silk',
            stichingFit: 'Slim fit',
            fabricColor: 'Black',
            quantity: 3,
            price: 250.00,
            amountPaid: 250.00,
            amountRemaining: 0.00,
            paymentMethod: 'Cash',
            paymentStatus: 'Paid',
            deliveryMethod: 'Delivery',
            deliveryAddress: '456 Oak Ave, Kumasi',
            deliveryStatus: 'Delivered',
            buckramType: 'original',
            status: 4, // Delivered
            notes: 'Handle with care - delicate fabric',
            lastUpdated: new Date('2023-05-26'),
            completedDate: new Date('2023-05-24'),
            customerId: 'CUST-003',
            garmentTypeId: 'GT-103',
            isActive: true, 
            isDeleted: false, 
            createdAtDateTime : new Date(), 
            updatedAtDateTime: new Date()
          },
          {
            orderId: 'ORD-1004',
            orderDate: new Date('2023-04-10'),
            deliveryDate: new Date('2023-05-01'),
            fabricDetails: 'Polyester Blend',
            stichingFit: 'Regular fit',
            fabricColor: 'Burgundy',
            quantity: 1,
            price: 65.00,
            amountPaid: 0.00,
            amountRemaining: 65.00,
            paymentMethod: 'Cash',
            paymentStatus: 'Unpaid',
            deliveryMethod: 'Pickup',
            deliveryAddress: '',
            deliveryStatus: 'Overdue',
            buckramType: 'normal',
            status: 2, // OverDue
            lastUpdated: new Date('2023-05-02'),
            cancelledDate: new Date('2023-05-03'),
            cancellationReason: 'Customer did not pickup',
            customerId: 'CUST-004',
            garmentTypeId: 'GT-104',
            isActive: true, 
            isDeleted: false, 
            createdAtDateTime : new Date(), 
            updatedAtDateTime: new Date()
          },
          {
            orderId: 'ORD-1005',
            orderDate: new Date('2023-06-01'),
            deliveryDate: new Date('2023-06-20'),
            fabricDetails: 'Wool Blend',
            stichingFit: 'Regular fit',
            fabricColor: 'Dark Brown',
            quantity: 2,
            price: 180.00,
            amountPaid: 90.00,
            amountRemaining: 90.00,
            paymentMethod: 'Card',
            paymentStatus: 'Partially Paid',
            deliveryMethod: 'Delivery',
            deliveryAddress: '789 Palm St, Takoradi',
            deliveryStatus: 'Pending',
            buckramType: 'original',
            status: 4, // Ordered
            notes: 'Urgent - needed for wedding',
            lastUpdated: new Date('2023-06-02'),
            customerId: 'CUST-005',
            garmentTypeId: 'GT-105',
            isActive: true, 
            isDeleted: false, 
            createdAtDateTime : new Date(), 
            updatedAtDateTime: new Date()
          }
        ];
    return dummyOrders;
}