"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Loader2, Calendar, MapPin, User, FileText, CheckCircle, Plus } from 'lucide-react';
import { useEffect, useState, use } from 'react';
import { projectService, Project } from '@/services/projectService';
import { workOrderService, WorkOrder } from '@/services/workOrderService';
import StatusBadge from '@/app/components/shared/StatusBadge';
import Link from 'next/link';

interface ProjectDetailsProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetails({ params }: ProjectDetailsProps) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const projData = await projectService.getProjectById(id);
      setProject(projData);

      const woData = await workOrderService.getWorkOrdersByProjectId(id);
      setWorkOrders(woData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-12 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
          Loading project details...
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="p-6 text-center text-red-500 font-semibold">
          Project not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Back and Title */}
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/project/list" className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white border">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{project.projectCode}</span>
            <h2 className="text-2xl font-bold text-gray-800">{project.projectName}</h2>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Project Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Project Number</p>
                    <p className="text-sm font-semibold text-gray-800">{project.projectNumber || 'None'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Customer</p>
                    <p className="text-sm font-semibold text-gray-800">{project.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Site Name & Location</p>
                    <p className="text-sm font-semibold text-gray-800">{project.siteName || 'N/A'}, {project.location || ''}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Expected Completion</p>
                    <p className="text-sm font-semibold text-gray-800">{project.expectedCompletion || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Stakeholders</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Consultant</p>
                  <p className="text-sm font-bold text-gray-700 mt-1">{project.consultant || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Contractor</p>
                  <p className="text-sm font-bold text-gray-700 mt-1">{project.contractor || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Site Engineer</p>
                  <p className="text-sm font-bold text-gray-700 mt-1">{project.engineer || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Actions Sidebar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                  <span className="text-sm font-semibold text-blue-800">Total Work Orders</span>
                  <span className="text-2xl font-bold text-blue-900">{workOrders.length}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">Project Status</span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                    project.status?.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <Link
                href={`/work-order/add?customerId=${project.customerId}&projectId=${project.id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Create Work Order</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Associated Work Orders List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Associated Work Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">WO Number</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Received Date</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {workOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                      No Work Orders registered under this project.
                    </td>
                  </tr>
                ) : (
                  workOrders.map((wo) => (
                    <tr key={wo.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                        <Link href={`/work-order/${wo.id}`} className="hover:underline">
                          {wo.workOrderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wo.receivedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wo.dueDate || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{wo.priority}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={wo.status || 'OPEN'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                        <Link href={`/work-order/${wo.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
