export interface CustomerCreate {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    address: string;
    city?: string;
}