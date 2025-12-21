export enum UserRole {
    Admin='Admin',
    Manager='Manager',
}
export interface ZellerCustomer {
    id: string;
    name: string;
    email: string;
    role: UserRole,
}

export interface ZellerCustomerResponse {
    items: ZellerCustomer[];
    nextToken?: string| null
}

export interface FetchCustomersResult {
    customerListData?: ZellerCustomerResponse;
    customerListError?: Error;
}
