import { ModleBase } from "../../contracts/base-modal";

export interface Customer extends ModleBase {
    customerId: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    email?: string;
    address: string;
    city?: string;
    age?: number;
    measurements?: any;
    orders?: any;
    isActive: boolean;
    isDeleted: boolean;
    notes?: string;
  }