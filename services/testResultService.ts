import { api } from './api';
import { ApiResponse } from './sampleService';

export interface TestResult {
    id?: string;
    sampleTestId: string;
    sampleId?: string;
    sampleCode?: string;
    testDefinitionId?: string;
    testName?: string;
    observations?: string; // JSON string
    calculations?: string;  // JSON string
    finalResult?: string;
    unit?: string;
    specOperator?: string;
    specValue?: string;
    passFail?: string; // PASS, FAIL, NONE
    attachments?: string; // JSON string array
    version?: number;
    remarks?: string;
    status?: string; // DRAFT, SUBMITTED, UNDER_REVIEW, VERIFIED, APPROVED, REJECTED
    testedById?: string;
    testedByName?: string;
    testingStartedAt?: string;
    testingCompletedAt?: string;
    submittedAt?: string;
}

export interface TechnicianMetrics {
    assigned: number;
    inProgress: number;
    completed: number;
    overdue: number;
}

export const testResultService = {
    getResultForSampleTest: async (sampleTestId: string): Promise<TestResult> => {
        const response = await api.get<ApiResponse<TestResult>>(`/test-results/sample-test/${sampleTestId}`);
        return response.data.data;
    },

    getResultById: async (id: string): Promise<TestResult> => {
        const response = await api.get<ApiResponse<TestResult>>(`/test-results/${id}`);
        return response.data.data;
    },

    saveDraft: async (payload: TestResult): Promise<TestResult> => {
        const response = await api.post<ApiResponse<TestResult>>('/test-results', payload);
        return response.data.data;
    },

    updateDraft: async (id: string, payload: TestResult): Promise<TestResult> => {
        const response = await api.put<ApiResponse<TestResult>>(`/test-results/${id}`, payload);
        return response.data.data;
    },

    submitResult: async (id: string): Promise<TestResult> => {
        const response = await api.post<ApiResponse<TestResult>>(`/test-results/${id}/submit`);
        return response.data.data;
    },

    rejectResult: async (id: string, remarks?: string): Promise<TestResult> => {
        const response = await api.post<ApiResponse<TestResult>>(`/test-results/${id}/reject`, null, {
            params: { remarks }
        });
        return response.data.data;
    },

    getPendingReview: async (): Promise<TestResult[]> => {
        const response = await api.get<ApiResponse<TestResult[]>>('/test-results/pending-review');
        return response.data.data;
    },

    getTechnicianResults: async (techId: string): Promise<TestResult[]> => {
        const response = await api.get<ApiResponse<TestResult[]>>(`/test-results/technician/${techId}`);
        return response.data.data;
    },

    getTechnicianMetrics: async (techId: string): Promise<TechnicianMetrics> => {
        const response = await api.get<ApiResponse<TechnicianMetrics>>(`/test-results/technician/${techId}/metrics`);
        return response.data.data;
    },

    verifyResult: async (id: string, remarks?: string): Promise<TestResult> => {
        const response = await api.post<ApiResponse<TestResult>>(`/test-results/${id}/verify`, null, {
            params: { remarks }
        });
        return response.data.data;
    },

    approveResult: async (id: string, remarks?: string): Promise<TestResult> => {
        const response = await api.post<ApiResponse<TestResult>>(`/test-results/${id}/approve`, null, {
            params: { remarks }
        });
        return response.data.data;
    },

    getPendingApprovals: async (): Promise<TestResult[]> => {
        const response = await api.get<ApiResponse<TestResult[]>>('/test-results/pending-approval');
        return response.data.data;
    }
};
