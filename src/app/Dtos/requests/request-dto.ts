import { EOrderStatus, EParameterType, EPaymentMethod, EPaymentStatus, ERole } from "../../enums/enums";

export interface User {
    id?: number | null;
    userName?: string | null;
    normalizedUserName?: string | null;
    email?: string | null;
    normalizedEmail?: string | null;
    emailConfirmed?: boolean | null;
    passwordHash?: string | null;
    securityStamp?: string | null;
    concurrencyStamp?: string | null;
    phoneNumber?: string | null;
    phoneNumberConfirmed?: boolean | null;
    twoFactorEnabled?: boolean | null;
    lockoutEnd?: Date | string | null;
    lockoutEnabled?: boolean | null;
    accessFailedCount?: number | null;

    userId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    dateOfBirth?: Date | string | null;
    address?: string | null;
    city?: string | null;
    outstanding?: number | null;
    refreshToken?: string | null;
    refreshTokenExpiry?: Date | string | null;
    primaryRole?: ERole | null;
    primaryRoleStr?: string | null;
    notes?: string | null;
    totalOrders?: number | null;
    
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    createdByUserId?: number | null;
    isDeleted?: boolean | null;
    isActive?: boolean | null;
    deletedAt?: Date | string | null;
    
    measurements?: Measurement[] | null;
    orders?: Order[] | null;
    business?: Business | null;
    payments?: Payment[] | null;
    roles?: string[] | null;
}



export interface Business {
    id?: number | null;
    name?: string | null;
    phone?: string | null;
    address?: string | null;
    website?: string | null;
    description?: string | null;
    
    // BaseEntity fields
    updatedAt?: Date | string | null;
    applicationUserId?: number | null;
    createdByUserId?: number | null;
    isDeleted?: boolean | null;
    isActive?: boolean | null;
    createdAt?: Date | string | null;
    deletedAt?: Date | string | null;
    
    // Navigation properties
    applicationUser?: User | null;
    branches?: Branch[] | null;
    suitTypes?: SuitType[] | null;
    measurements?: Measurement[] | null;
    orders?: Order[] | null;
    orderItems?: OrderItem[] | null;
    payments?: Payment[] | null;
}

export interface Branch {
    id?: number | null;
    businessId?: number | null;
    applicationUserId?: number | null;
    name?: string | null;
    address?: string | null;
    phone?: string | null;
    latitude?: number | null;
    longitude?: number | null;

    // BaseEntity fields
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    createdByUserId?: number | null;
    isDeleted?: boolean | null;
    isActive?: boolean | null;
    deletedAt?: Date | string | null;

    // Navigation properties
    business?: Business | null;
    applicationUser?: User | null;
    orders?: Order[] | null;
    payments?: Payment[] | null;
}


export interface Order {
    id?: number | null;
    businessId?: number | null;
    branchId?: number | null;
    orderOId?: string | null;
    totalItems?: number | null;
    orderDate?: Date | string | null;
    deliveryDate?: Date | string | null;
    orderStatus?: EOrderStatus | null;
    paymentStatus?: EPaymentStatus | null;
    totalAmount?: number | null;
    paidAmount?: number | null;
    discountAmount?: number | null;
    discountPercentage?: number | null;
    notes?: string | null;
    applicationUserId?: number | null;

    // BaseEntity fields
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    createdByUserId?: number | null;
    isDeleted?: boolean | null;
    isActive?: boolean | null;
    deletedAt?: Date | string | null;

    // Navigation properties
    applicationUser?: User | null;
    business?: Business | null;
    branch?: Branch | null;
    orderItems?: OrderItem[] | null;
    payments?: Payment[] | null;
}

export interface Measurement {
    id?: number | null;
    businessId?: number | null;
    name?: string | null;
    applicationUserId?: number | null;
    suitTypeId?: number | null;

    // BaseEntity fields
    isDeleted?: boolean | null;
    isActive?: boolean | null;
    createdByUserId?: number | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    deletedAt?: Date | string | null;

    // Navigation properties
    applicationUser?: User | null;
    suitType?: SuitType | null;
    business?: Business | null;
    measurementDetails?: MeasurementDetails[] | null;
    orderItems?: OrderItem[] | null;
}

export class MeasurementDetails {
    id?: number | null;
    measurementId?: number | null;
    suitTypeParameterId?: number | null;
    value?: string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    measurement?: Measurement | null;
    suitTypeParameter?: SuitTypeParameter | null;
}

export interface Payment {
    id?: number | null;
    applicationUserId?: number | null;
    orderId?: number | null;
    businessId?: number | null;
    branchId?: number | null;
    amount?: number | null;
    paymentDate?: Date | string | null;
    paymentMethod?: EPaymentMethod | null;
    notes?: string | null;
    
    // BaseEntity fields
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    createdByUserId?: number | null;
    isDeleted?: boolean | null;
    isActive?: boolean | null;
    deletedAt?: Date | string | null;
    
    // Navigation properties
    order?: Order | null;
    business?: Business | null;
    branch?: Branch | null;
    applicationUser?: User | null;
}

export interface Login {
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe?: boolean;
}


export interface SuitType {
    id?: number | null;
    businessId?: number | null;
    name?: string | null;
    description?: string | null;
    price?: number | null;  // decimal in C# becomes number in TypeScript

    // BaseEntity fields
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    createdByUserId?: number | null;
    isDeleted?: boolean | null;
    isActive?: boolean | null;
    deletedAt?: Date | string | null;
    business?: Business | null;
    suitTypeParameters?: SuitTypeParameter[] | null;
    measurements?: Measurement[] | null;
    orderItems?: OrderItem[] | null;
}


export interface SuitTypeParameter {
    id?: number | null;
    name?: string | null;
    placeHolder?: string | null;
    parameterType?: EParameterType | null;
    parameterOptions?: string | null;
    isRequired?: boolean | null;
    suitTypeId?: number | null;

    // BaseEntity fields
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    createdByUserId?: number | null;
    isDeleted?: boolean | null;
    isActive?: boolean | null;
    deletedAt?: Date | string | null;

    // Navigation property
    suitType?: SuitType | null;
}


export interface OrderItem {
    id?: number | null;
    businessId?: number | null;
    suitTypeId?: number | null;
    orderId?: number | null;
    measurementId?: number | null;
    quantity?: number | null;
    price?: number | null;
    totalAmount?: number | null;
    discountAmount?: number | null;
    discountPercentage?: number | null;
    notes?: string | null;

    // BaseEntity fields
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    createdByUserId?: number | null;
    isDeleted?: boolean | null;
    isActive?: boolean | null;
    deletedAt?: Date | string | null;

    // Navigation properties
    business?: Business | null;
    suitType?: SuitType | null;
    order?: Order | null;
    measurement?: Measurement | null;
}


