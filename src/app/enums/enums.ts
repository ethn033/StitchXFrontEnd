/** User roles enumeration */
export enum ERole {
  /** Default value for filtering all roles */
  ALL = 0,
  /** Software owner/administrator */
  SOFT_OWNER = 1,
  /** Shop owner/manager */
  SHOP_OWNER = 2,
  /** Tailor role */
  TAILOR = 3,
  /** Cutter role */
  CUTTER = 4,
  /** Sweeper/cleaner role */
  SWEEPER = 5,
  /** Customer role (default) */
  CUSTOMER = 6,
  /** Demo user role */
  DEMO_USER = 7
}

/** Suit type parameters enumeration */
export enum EParameterType {
  /** Default value for filtering all parameter types */
  ALL = 0,
  /** Text input */
  TEXT = 1,
  /** Number input */
  NUMBER = 2,
  /** Radio button */
  RADIO = 3,
  /** Checkbox */
  CHECKBOX = 4,
  /** Dropdown select */
  SELECT = 5,
  /** Date picker */
  DATE = 6,
  /** Multiline text */
  TEXTAREA = 7,
  /** File upload */
  FILE = 8
}

/** Order status enumeration */
export enum EOrderStatus {
  /** Default value for filtering */
  ALL = 0,
  /** Being configured */
  DRAFT = 1,
  /** Customer committed */
  RECEIVED = 2,
  /** Fabric/trims sourced */
  MATERIALS_ORDERED = 3,
  /** Cutting/sewing started */
  IN_PROGRESS = 4,
  /** Initial try-on */
  FIRST_FITTING = 5,
  /** Adjustments needed */
  ADJUSTMENT = 6,
  /** Ready for pickup */
  FINAL_FITTING = 7,
  /** Order completed */
  COMPLETED = 8,
  /** Delivered to customer */
  DELIVERED = 9,
  /** Over due */
  OVER_DUE = 10,
  /** Order cancelled */
  CANCELLED = 11
}

/** Payment status enumeration */
export enum EPaymentStatus {
  /** Default value for filtering */
  ALL = 0,
  /** Order created but no payment */
  PENDING = 1,
  /** Deposit paid (30-50% upfront) */
  DEPOSIT_PAID = 2,
  /** Additional payments during fittings */
  PARTIALLY_PAID = 3,
  /** Full payment received */
  PAID = 4,
  /** Fully refunded */
  REFUNDED = 5,
  /** Partially refunded */
  PARTIALLY_REFUNDED = 6,
  /** Payment attempt failed */
  FAILED = 7
}

/** Payment method enumeration */
export enum EPaymentMethod {
  /** Default value for filtering */
  ALL = 0,
  /** Cash payment */
  CASH = 1,
  /** Card payment */
  CARD = 2,
  /** Bank transfer */
  BANK_TRANSFER = 3,
  /** Cheque payment */
  CHEQUE = 4,
  /** EasyPaisa digital wallet */
  EASY_PAISA = 5,
  /** JazzCash digital wallet */
  JAZ_CASH = 6
}