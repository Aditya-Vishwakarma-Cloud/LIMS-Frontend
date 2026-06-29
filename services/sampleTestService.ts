import { api } from './api';
import { ApiResponse } from './sampleService';
import { Sample } from './sampleService';

export interface SampleTest {
    id?: string;
    sampleId: string;
    sampleCode?: string;
    testDefinitionId: string;
    testName?: string;
    testCode?: string;
    unit?: string;
    specification?: string;
    method?: string;
    isMandatory?: boolean;
    specOperator?: string;
    specValue?: string;
    valueType?: string;
    technicianId?: string;
    technicianName?: string;
    assignedById?: string;
    assignedByName?: string;
    assignedDate?: string;
    scheduledDate?: string;
    dueDate?: string;
    sequenceNumber: number;
    status: string; // PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, VERIFIED
    remarks?: string;
}

export interface SampleTestHistory {
    id?: string;
    sampleTestId: string;
    changeType: string;
    oldTechnicianId?: string;
    oldTechnicianName?: string;
    newTechnicianId?: string;
    newTechnicianName?: string;
    oldDueDate?: string;
    newDueDate?: string;
    oldStatus?: string;
    newStatus: string;
    changedById: string;
    changedByName?: string;
    changedAt: string;
    remarks?: string;
}

export interface SingleTestAssignment {
    testDefinitionId: string;
    technicianId?: string;
    scheduledDate?: string;
    dueDate?: string;
    sequenceNumber: number;
    remarks?: string;
}

export interface SampleTestAssignment {
    mode: 'INITIAL' | 'ADDITIONAL' | 'REASSIGN';
    assignments: SingleTestAssignment[];
}

export const sampleTestService = {
    getPendingSamples: async (): Promise<Sample[]> => {
        const response = await api.get<ApiResponse<Sample[]>>('/sample-tests/pending');
        return response.data.data;
    },

    getSampleTests: async (sampleId: string): Promise<SampleTest[]> => {
        const response = await api.get<ApiResponse<SampleTest[]>>(`/samples/${sampleId}/tests`);
        return response.data.data;
    },

    assignTests: async (sampleId: string, payload: SampleTestAssignment): Promise<SampleTest[]> => {
        const response = await api.post<ApiResponse<SampleTest[]>>(`/samples/${sampleId}/assign-tests`, payload);
        return response.data.data;
    },

    updateSampleTest: async (id: string, payload: Partial<SampleTest>): Promise<SampleTest> => {
        const response = await api.put<ApiResponse<SampleTest>>(`/sample-tests/${id}`, payload);
        return response.data.data;
    },

    getSampleTestById: async (id: string): Promise<SampleTest> => {
        const response = await api.get<ApiResponse<SampleTest>>(`/sample-tests/${id}`);
        return response.data.data;
    },

    getTechnicianWorkload: async (technicianId: string): Promise<SampleTest[]> => {
        const response = await api.get<ApiResponse<SampleTest[]>>(`/sample-tests/technician/${technicianId}`);
        return response.data.data;
    },

    getSampleTestHistory: async (id: string): Promise<SampleTestHistory[]> => {
        const response = await api.get<ApiResponse<SampleTestHistory[]>>(`/sample-tests/${id}/history`);
        return response.data.data;
    }
};
