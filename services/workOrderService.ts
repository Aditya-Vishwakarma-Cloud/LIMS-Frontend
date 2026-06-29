import { api } from './api';

export interface WorkOrder {
    id?: string;
    workOrderNumber?: string;
    customerId: string;
    customerName?: string;
    projectId: string;
    projectName?: string;
    receivedDate: string;
    dueDate?: string;
    priority?: string;
    requestedById?: string;
    requestedByName?: string;
    remarks?: string;
    status?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const workOrderService = {
    getAllWorkOrders: async (): Promise<WorkOrder[]> => {
        const response = await api.get<ApiResponse<WorkOrder[]>>('/work-orders');
        return response.data.data;
    },
    
    getWorkOrderById: async (id: string): Promise<WorkOrder> => {
        const response = await api.get<ApiResponse<WorkOrder>>(`/work-orders/${id}`);
        return response.data.data;
    },

    getWorkOrdersByCustomerId: async (customerId: string): Promise<WorkOrder[]> => {
        const response = await api.get<ApiResponse<WorkOrder[]>>(`/work-orders/customer/${customerId}`);
        return response.data.data;
    },

    getWorkOrdersByProjectId: async (projectId: string): Promise<WorkOrder[]> => {
        const response = await api.get<ApiResponse<WorkOrder[]>>(`/work-orders/project/${projectId}`);
        return response.data.data;
    },
    
    createWorkOrder: async (data: WorkOrder): Promise<WorkOrder> => {
        const response = await api.post<ApiResponse<WorkOrder>>('/work-orders', data);
        return response.data.data;
    },
    
    updateWorkOrder: async (id: string, data: WorkOrder): Promise<WorkOrder> => {
        const response = await api.put<ApiResponse<WorkOrder>>(`/work-orders/${id}`, data);
        return response.data.data;
    },
    
    deleteWorkOrder: async (id: string): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/work-orders/${id}`);
    }
};
