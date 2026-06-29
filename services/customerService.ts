import { api } from './api';

export interface ContactPerson {
    id?: string;
    name: string;
    designation?: string;
    phone?: string;
    email?: string;
    customerId?: string;
}

export interface Customer {
    id?: string;
    customerCode?: string;
    customerName: string;
    aliasName?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    currency?: string;
    area?: string;
    pinCode?: string;
    customerType?: string;
    block?: string;
    blockReason?: string;
    salutations?: string;
    contactPerson?: string; // Legacy simple primary contact name
    description?: string;
    emailId?: string;
    mobileNumber?: string;
    telephoneNumber?: string;
    vendorCode?: string;
    tallyLedgerName?: string;
    gstNo?: string;
    discount?: string;
    gstNotApplicable?: boolean;
    sez?: boolean;
    serviceTaxNote?: string;
    panNo?: string;
    sacNo?: string;
    salesManager?: string;
    dispatchMode?: string;
    industry?: string;
    alternateEmailId?: string;
    alternateMobileNo?: string;
    alternateTelephoneNo?: string;
    faxNo?: string;
    alternateAddress?: string;
    
    // Multi contact & primary contact details
    primaryContactId?: string;
    primaryContactName?: string;
    contactPersons?: ContactPerson[];

    // Optimized Dashboard counts
    totalProjects?: number;
    totalWorkOrders?: number;
    totalSamples?: number;

    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const customerService = {
    getAllCustomers: async (): Promise<Customer[]> => {
        const response = await api.get<ApiResponse<Customer[]>>('/customers');
        return response.data.data;
    },
    
    getCustomerById: async (id: string): Promise<Customer> => {
        const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
        return response.data.data;
    },
    
    createCustomer: async (customerData: Customer): Promise<Customer> => {
        const response = await api.post<ApiResponse<Customer>>('/customers', customerData);
        return response.data.data;
    },
    
    updateCustomer: async (id: string, customerData: Customer): Promise<Customer> => {
        const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, customerData);
        return response.data.data;
    },
    
    deleteCustomer: async (id: string): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/customers/${id}`);
    }
};
