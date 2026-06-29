import { api } from './api';
import { ApiResponse, Sample } from './sampleService';

export interface TechWorkload {
  name: string;
  assigned: number;
  active: number;
  completed: number;
}

export interface ReceptionQueue {
  client: string;
  project: string;
  status: string;
  due: string;
}

export interface TechnicianTest {
  sampleTestId: string;
  sampleCode: string;
  testName: string;
  priority: string;
  dueDate: string;
  status: string;
}

export interface QEPendingReview {
  testResultId: string;
  sampleCode: string;
  testName: string;
  technicianName: string;
  submittedDate: string;
}

export interface ClientSample {
  id: string;
  materialName: string;
  projectName: string;
  status: string;
  date: string;
}

export interface ClientDownload {
  id: string;
  title: string;
  projectName: string;
  date: string;
}

export interface DashboardStats {
  todaySamples: number;
  pendingAssignments: number;
  pendingQAReviews: number;
  pendingSignOff: number;
  reportsReleasedToday: number;
  invoicesPending: number;
  activeCustomers: number;
  totalLaboratories: number;
  totalSystemUsers: number;
  totalProjects: number;
  totalRegisteredSamples: number;
  todayActiveTests: number;

  awaitingAssignment: number;
  testsInProgress: number;
  testingComplete: number;
  pendingQEReview: number;
  overdueTests: number;
  completedToday: number;

  // Reception
  todayWorkOrders: number;
  registeredToday: number;
  pendingPhysicalReceipt: number;
  pendingRegistrations: number;
  receptionIncomingQueue: ReceptionQueue[];

  // Technician
  assignedTests: number;
  activeTesting: number;
  draftResults: number;
  completedTodayTech: number;
  technicianActiveTestsList: TechnicianTest[];

  // QE
  qePendingReviews: number;
  qeRejectedResults: number;
  qeApprovedToday: number;
  qeReportsReady: number;
  qeOverdueReviews: number;
  qePendingReviewsList: QEPendingReview[];

  // Client
  clientProjectsCount: number;
  clientActiveWorkOrdersCount: number;
  clientSamplesSubmittedCount: number;
  clientReportsAvailableCount: number;
  clientInvoicesCount: number;
  clientRecentSamplesList: ClientSample[];
  clientReportDownloadsList: ClientDownload[];

  samplesByMaterial: Record<string, number>;
  workflowProgression: Record<string, number>;

  pendingSamplesList: Sample[];
  technicianWorkloadList: TechWorkload[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data;
  }
};
