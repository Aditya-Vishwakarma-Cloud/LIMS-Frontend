import { api } from './api';

export interface Material {
    id?: string;
    materialCode: string;
    materialName: string;
    samplePrefix: string;
    description?: string;
    active: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const materialService = {
    getAllMaterials: async (): Promise<Material[]> => {
        const response = await api.get<ApiResponse<Material[]>>('/materials');
        return response.data.data;
    },
    
    getMaterialById: async (id: string): Promise<Material> => {
        const response = await api.get<ApiResponse<Material>>(`/materials/${id}`);
        return response.data.data;
    },
    
    createMaterial: async (data: Material): Promise<Material> => {
        const response = await api.post<ApiResponse<Material>>('/materials', data);
        return response.data.data;
    },
    
    updateMaterial: async (id: string, data: Material): Promise<Material> => {
        const response = await api.put<ApiResponse<Material>>(`/materials/${id}`, data);
        return response.data.data;
    },
    
    deleteMaterial: async (id: string): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/materials/${id}`);
    }
};
