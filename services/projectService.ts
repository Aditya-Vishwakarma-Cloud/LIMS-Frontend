import { api } from './api';

export interface Project {
    id?: string;
    projectCode?: string;
    projectNumber?: string;
    projectName: string;
    siteName?: string;
    engineer?: string;
    consultant?: string;
    contractor?: string;
    location?: string;
    expectedCompletion?: string;
    status?: string;
    customerId: string;
    customerName?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const projectService = {
    getAllProjects: async (): Promise<Project[]> => {
        const response = await api.get<ApiResponse<Project[]>>('/projects');
        return response.data.data;
    },
    
    getProjectById: async (id: string): Promise<Project> => {
        const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
        return response.data.data;
    },

    getProjectsByCustomerId: async (customerId: string): Promise<Project[]> => {
        const response = await api.get<ApiResponse<Project[]>>(`/projects/customer/${customerId}`);
        return response.data.data;
    },
    
    createProject: async (data: Project): Promise<Project> => {
        const response = await api.post<ApiResponse<Project>>('/projects', data);
        return response.data.data;
    },
    
    updateProject: async (id: string, data: Project): Promise<Project> => {
        const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, data);
        return response.data.data;
    },
    
    deleteProject: async (id: string): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/projects/${id}`);
    }
};
