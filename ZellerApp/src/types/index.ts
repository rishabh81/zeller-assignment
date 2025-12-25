export enum UserRole {
    Admin='Admin',
    Manager='Manager',
}
export type UserType = 'All'| UserRole;
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

export interface IFormData {
    firstname: string;
    lastname: string;
    email: string;
    role: UserRole;
}

export interface IupdateFormData extends IFormData {
    id: string
}

export type RootStackParamList = {
    CustomerList: undefined;
    AddCustomer: undefined;
    EditCustomer: {
        customer: ZellerCustomer;
    };
  };
