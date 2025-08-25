export enum ERole {
  ALL = 0,
  SOFT_OWNER = 1,
  SHOP_OWNER = 2,
  TAILOR = 3,
  CUTTER = 4,
  SWEEPER = 5,
  CUSTOMER = 6,
  DEMO_USER = 7
}

export enum EParameterType {
  ALL = 0,
  INPUT_TEXT = 1,
  INPUT_NUMBER = 2,
  SINGLE_SELECT_OPTION = 3,
  MULTI_SELECT_OPTIONS = 4
}

export enum EOrderStatus {
  ALL = 0,
  DRAFT = 1,
  RECEIVED = 2,
  MATERIALS_ORDERED = 3,
  IN_PROGRESS = 4,
  FIRST_FITTING = 5,
  ADJUSTMENT = 6,
  FINAL_FITTING = 7,
  COMPLETED = 8,
  DELIVERED = 9,
  OVER_DUE = 10,
  CANCELLED = 11
}

export enum EPaymentStatus {
  ALL = 0,
  PENDING = 1,
  DEPOSIT_PAID = 2,
  PARTIALLY_PAID = 3,
  PAID = 4,
  REFUNDED = 5,
  PARTIALLY_REFUNDED = 6,
  FAILED = 7
}

export enum EPaymentMethod {
  ALL = 0,
  CASH = 1,
  CARD = 2,
  BANK_TRANSFER = 3,
  CHEQUE = 4,
  EASY_PAISA = 5,
  JAZ_CASH = 6
}