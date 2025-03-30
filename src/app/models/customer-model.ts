export interface Customer {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
    address: string;
    age?: number;
    measurements: any;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }