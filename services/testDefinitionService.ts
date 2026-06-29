import { api } from './api';

export interface TestDefinition {
    id?: string;
    materialId: string;
    materialName?: string;
    materialCode?: string;
    testName: string;
    testCode?: string;
    unit?: string;
    specification?: string;
    method?: string;
    isMandatory?: boolean;
    active: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const testDefinitionService = {
    getAllTestDefinitions: async (): Promise<TestDefinition[]> => {
        const response = await api.get<ApiResponse<TestDefinition[]>>('/test-definitions');
        return response.data.data;
    },
    
    getTestDefinitionById: async (id: string): Promise<TestDefinition> => {
        const response = await api.get<ApiResponse<TestDefinition>>(`/test-definitions/${id}`);
        return response.data.data;
    },

    getTestDefinitionsByMaterialId: async (materialId: string): Promise<TestDefinition[]> => {
        const response = await api.get<ApiResponse<TestDefinition[]>>(`/test-definitions/material/${materialId}`);
        return response.data.data;
    },
    
    createTestDefinition: async (data: TestDefinition): Promise<TestDefinition> => {
        const response = await api.post<ApiResponse<TestDefinition>>('/test-definitions', data);
        return response.data.data;
    },
    
    updateTestDefinition: async (id: string, data: TestDefinition): Promise<TestDefinition> => {
        const response = await api.put<ApiResponse<TestDefinition>>(`/test-definitions/${id}`, data);
        return response.data.data;
    },
    
    deleteTestDefinition: async (id: string): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/test-definitions/${id}`);
    }
};
