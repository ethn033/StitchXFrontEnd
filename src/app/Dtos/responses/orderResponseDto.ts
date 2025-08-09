import { EOrderStatus, EPaymentStatus } from "../../enums/enums";

export interface OrderItemDto {
  price: number;
  suitType: string;
  quantity: number;
  createdAt?: Date;
  totalAmount: number;
  discountAmount: number;
  discountPercentage: number;
  notes?: string;
}

export interface OrderHistoryItemResponseDto {
  orderOId: string;
  customerId: number;
  orderDate: Date;
  deliveryDate?: Date;
  orderStatus: EOrderStatus;
  paymentStatus: EPaymentStatus;
  totalAmount: number;
  paidAmount: number;
  totalItems: number;
  orderItems: OrderItemDto[];
  lastUpdated?: Date;
}

export interface OrderHistoryResponseDto {
  orders?: OrderHistoryItemResponseDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}