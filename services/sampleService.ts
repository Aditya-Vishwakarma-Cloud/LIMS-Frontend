import { api } from './api';

export interface Sample {
    id?: string;
    sampleId?: string;
    workOrderId: string;
    workOrderNumber?: string;
    customerName?: string;
    projectName?: string;
    materialId: string;
    materialName?: string;
    materialCode?: string;
    quantity: number;
    unit?: string;
    collectionDate?: string;
    collectionLocation?: string;
    collectedById?: string;
    collectedByName?: string;
    receivedDate?: string;
    receivedTime?: string;
    receivedById?: string;
    receivedByName?: string;
    condition?: string; // GOOD, DAMAGED, BROKEN, CONTAMINATED, WET, OTHER
    status?: string; // REGISTERED, RECEIVED, ASSIGNED, TESTING, REVIEW, APPROVED, REPORT_GENERATED, DELIVERED, ARCHIVED, REJECTED
    priority?: string; // Normal, High, Urgent, Low
    remarks?: string;
}

export interface SampleHistory {
    id?: string;
    sampleId: string;
    sampleCode: string;
    oldStatus?: string;
    newStatus: string;
    changedById?: string;
    changedByName?: string;
    changedAt: string;
    remarks?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const sampleService = {
    getAllSamples: async (): Promise<Sample[]> => {
        const response = await api.get<ApiResponse<Sample[]>>('/samples');
        return response.data.data;
    },
    
    getSampleById: async (id: string): Promise<Sample> => {
        const response = await api.get<ApiResponse<Sample>>(`/samples/${id}`);
        return response.data.data;
    },

    getSamplesByWorkOrderId: async (workOrderId: string): Promise<Sample[]> => {
        const response = await api.get<ApiResponse<Sample[]>>(`/samples/work-order/${workOrderId}`);
        return response.data.data;
    },
    
    createSample: async (data: Sample): Promise<Sample> => {
        const response = await api.post<ApiResponse<Sample>>('/samples', data);
        return response.data.data;
    },
    
    updateSample: async (id: string, data: Sample): Promise<Sample> => {
        const response = await api.put<ApiResponse<Sample>>(`/samples/${id}`, data);
        return response.data.data;
    },

    receiveSample: async (id: string, receiveDetails: Partial<Sample>): Promise<Sample> => {
        const response = await api.put<ApiResponse<Sample>>(`/samples/${id}/receive`, receiveDetails);
        return response.data.data;
    },

    updateSampleStatus: async (id: string, status: string, remarks: string = ''): Promise<Sample> => {
        const response = await api.put<ApiResponse<Sample>>(
            `/samples/${id}/status?status=${encodeURIComponent(status)}&remarks=${encodeURIComponent(remarks)}`
        );
        return response.data.data;
    },

    getSampleHistory: async (id: string): Promise<SampleHistory[]> => {
        const response = await api.get<ApiResponse<SampleHistory[]>>(`/samples/${id}/history`);
        return response.data.data;
    },
    
    deleteSample: async (id: string): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/samples/${id}`);
    }
};
