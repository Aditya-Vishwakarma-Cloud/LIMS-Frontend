import { api } from './api';

export interface Customer {
    id?: string;
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
    contactPerson?: string;
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
    createdAt?: string;
    updatedAt?: string;
}

export const customerService = {
    getAllCustomers: async () => {
        const response = await api.get<Customer[]>('/customers');
        return response.data;
    },
    
    getCustomerById: async (id: string) => {
        const response = await api.get<Customer>(`/customers/${id}`);
        return response.data;
    },
    
    createCustomer: async (customerData: Customer) => {
        const response = await api.post<Customer>('/customers', customerData);
        return response.data;
    },
    
    updateCustomer: async (id: string, customerData: Customer) => {
        const response = await api.put<Customer>(`/customers/${id}`, customerData);
        return response.data;
    },
    
    deleteCustomer: async (id: string) => {
        await api.delete(`/customers/${id}`);
    }
};
