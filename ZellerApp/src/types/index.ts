export enum EUserRole {
    Admin='Admin',
    Manager='Manager',
}
export type UserType = 'All'| EUserRole;
export interface IZellerCustomer {
    id: string;
    name: string;
    email: string;
    role: EUserRole,
}

export interface IZellerCustomerResponse {
    items: IZellerCustomer[];
    nextToken?: string| null
}

export interface IFetchCustomersResult {
    customerListData: IZellerCustomerResponse | null;
    customerListError?: Error;
    constomerLoading?: boolean
}

export interface IFormData {
    firstname: string;
    lastname: string;
    email: string;
    role: EUserRole;
}

export interface IupdateFormData extends IFormData {
    id: string
}

export type TRootStackParamList = {
    CustomerList: undefined;
    AddCustomer: undefined;
    EditCustomer: {
        customer: IZellerCustomer;
    };
  };
