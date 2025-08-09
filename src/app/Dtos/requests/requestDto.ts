import { EOrderStatus, EParameterType, EPaymentStatus, ERole } from "../../enums/enums";

/********************************** Authentication ****************************************/
/** 
 * Register DTO for user registration
 * Possible role values:
 * 1 - SOFT_OWNER
 * 2 - SHOP_OWNER
 * 3 - TAILOR
 * 4 - CUTTER
 * 5 - SWEEPER
 * 6 - CUSTOMER (default)
 * 7 - DEMO_USER
 */
export interface RegisterDto {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's email address */
  email: string;
  /** User's password (8-100 characters) */
  password: string;
  /** The role assigned to the user (default: CUSTOMER) */
  role?: ERole;
}

/** Login DTO for user authentication */
export interface LoginDto {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Whether to remember the user (default: false) */
  rememberMe?: boolean;
}
/********************************** Auth ends ****************************************/


/********************************** Suit types ****************************************/
/** DTO for creating/updating suit types */
export interface SuitTypeCreateDto {
  /** Optional ID for updates */
  id?: number;
  /** Suit type name (required, max 100 chars) */
  name: string;
  /** Suit type description (max 500 chars) */
  description?: string;
  /** Price (required) */
  price: number;
  /** Creation timestamp */
  createdAt?: Date;
  /** Last update timestamp */
  updatedAt?: Date;
  /** Creator user ID */
  createdByUserId?: number;
  /** Soft delete flag */
  isDeleted: boolean;
  /** Active status flag */
  isActive: boolean;
}
/********************************** Suit types ends ****************************************/



/********************************** Suit types ****************************************/
/** DTO for creating/updating suit type parameters */
export interface SuitTypeParameterCreateDTO {
  id?: number;
  /** Required suit type ID */
  suitTypeId: number;
  /** Required parameter name */
  name: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Parameter type (default: TEXT) */
  parameterType: EParameterType;
  /** Options for select/radio parameters */
  parameterOptions?: string;
  /** Whether parameter is required (default: false) */
  isRequired: boolean;
  createdAt: Date;
  updatedAt?: Date;
  createdByUserId: number;
  isDeleted: boolean;
  isActive: boolean;
}
/********************************** Suit types ends ****************************************/

/********************************** Customers ****************************************/
/** DTO for creating a customer */
export interface CreateCustomerRequest {
  /** Required first name */
  firstName: string;
  /** Required last name */
  lastName: string;
  /** Valid email address */
  email?: string;
  /** Valid phone number (at least 10 digits) */
  phoneNumber?: string;
  address?: string;
  city?: string;
  dateOfBirth?: Date;
  notes?: string;
}

/** DTO for updating a customer */
export interface UpdateCustomerRequest {
  /** First name (max 50 chars) */
  firstName?: string;
  /** Last name (max 50 chars) */
  lastName?: string;
  /** Valid email format */
  email?: string;
  /** Valid phone number format */
  phoneNumber?: string;
  /** Address (max 200 chars) */
  address?: string;
  /** City (max 50 chars) */
  city?: string;
  dateOfBirth?: Date;
  /** Notes (max 500 chars) */
  notes?: string;
  /** Non-negative outstanding balance */
  outstanding?: number;
  /** Non-negative total orders */
  totalOrders?: number;
}
/********************************** Customer ends ****************************************/


/********************************** Orders ****************************************/
/** DTO for filtering order history */
export interface OrderHistoryFilterDto {
  orderId: number;
  customerId: number;
  orderStatus: EOrderStatus;
  startDate: Date;
  endDate: Date;
}

/** DTO for order history pagination */
export interface OrderHistoryPaginationParamsDto {
  /** Page number (min 1) */
  page: number;
  /** Page size (1-100) */
  pageSize: number;
}

/** DTO for creating an order */
export interface CreateOrderRequestDto {
  /** Required customer ID */
  customerId: number;
  /** Required order date */
  orderDate: Date;
  /** Required delivery date */
  deliveryDate?: Date;
  /** Order status (default: RECEIVED) */
  orderStatus: EOrderStatus;
  /** Payment status (default: PENDING) */
  paymentStatus: EPaymentStatus;
  /** Required total amount */
  totalAmount: number;
  paidAmount: number;
  totalItems: number;
  notes?: string;
  /** List of order items */
  orderItems: OrderItemRequestDto[];
}

/** DTO for order items */
export interface OrderItemRequestDto {
  /** Required suit type ID */
  suitTypeId: number;
  /** Required order ID */
  orderId: number;
  /** Required measurement ID */
  measurementId: number;
  price: number;
  discountAmount: number;
  discountPercentage: number;
  notes?: string;
  /** Required quantity */
  quantity: number;
  createdAt: Date;
  updatedAt?: Date;
  createdByUserId: number;
  isDeleted: boolean;
  isActive: boolean;
}

/** DTO for updating order status */
export interface UpdateOrderStatusRequestDto {
  /** New status to transition to */
  newStatus: EOrderStatus;
  /** Notes about the status change */
  notes?: string;
}
/********************************** Order ends ****************************************/


/********************************** Measurements ****************************************/
/** DTO for measurements */
export interface MeasurementDto {
  id?: number;
  /** Required customer ID */
  applicationUserId: number;
  /** Required suit type ID */
  suitTypeId: number;
  isActive: boolean;
  /** List of measurement details */
  measurementDetailsDto: MeasurementDetailsDto[];
}

/** DTO for measurement details */
export interface MeasurementDetailsDto {
  id?: number;
  /** Required parameter ID */
  parameterId: number;
  /** Required measurement value */
  value: string;
  createdAt: Date;
  updatedAt?: Date;
  /** Required measurement ID */
  measurementId: number;
}

/** DTO for measurements pagination */
export interface MeasurementsPaginationParamsDto {
  /** Page number (min 1) */
  page: number;
  /** Page size (1-100) */
  pageSize: number;
}

/** DTO for filtering measurements */
export interface MeasurementFilterDto {
  customerId: number;
  isActive: boolean;
  suitTypeId: number;
  startDate: Date;
  endDate: Date;
}

/** DTO for creating/updating roles */
export interface RoleCreateUpdateDto {
  id?: number;
  /** Required role name (30 chars max, no spaces) */
  name: string;
  /** Description (100 chars max) */
  description?: string;
  businessId?: number;
}

/** DTO for creating/updating businesses */
export interface BusinessCreateUpdateDto {
  id?: number;
  /** Required business name (100 chars max) */
  name: string;
  /** Required owner ID */
  ownerId: number;
  phone?: string;
  website?: string;
  /** Description (500 chars max) */
  description?: string;
  isActive: boolean;
}

/** DTO for creating/updating branches */
export interface BranchCreateUpdateDto {
  id?: number;
  /** Required business ID */
  businessId: number;
  /** Required owner ID */
  ownerId: number;
  /** Required name (100 chars max) */
  name: string;
  /** Required address (200 chars max) */
  address: string;
  phone?: string;
  isActive: boolean;
}