import { ModleBase } from "../../contracts/base-modal";

export interface Order extends ModleBase {
    orderId: string;
    orderDate: Date;
    deliveryDate?: Date | null;
    fabricDetails: string;
    stichingFit: string; // e.g., Enum (Slim fit, Regular fit)
    fabricColor: string; // e.g., Blue, Black
    quantity: number;
    price: number;
    amountPaid: number;
    amountRemaining: number;
    paymentMethod: string; // e.g., Cash, Card, Mobile Money
    paymentStatus: string; // e.g., Paid, Unpaid, Partially Paid
    deliveryMethod: string; // e.g., Pickup, Delivery
    deliveryAddress: string;
    deliveryStatus: string; // e.g., Pending, Shipped, Delivered
    buckramType: string; // e.g., normal, original

    // Status tracking
    status: number; // e.g., Received, InProgress, Ready, Delivered
    notes?: string | null; // e.g., Special instructions
    lastUpdated: Date;
    completedDate?: Date | null;
    cancelledDate?: Date | null;
    cancellationReason?: string | null;

    customerId?: string | null;
    garmentTypeId?: string | null;
}
