"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Loader2, Calendar, User, FileText, Plus, Beaker } from 'lucide-react';
import { useEffect, useState, use } from 'react';
import { workOrderService, WorkOrder } from '@/services/workOrderService';
import { sampleService, Sample } from '@/services/sampleService';
import StatusBadge from '@/app/components/shared/StatusBadge';
import PriorityBadge from '@/app/components/shared/PriorityBadge';
import Link from 'next/link';

interface WorkOrderDetailsProps {
  params: Promise<{ id: string }>;
}

export default function WorkOrderDetails({ params }: WorkOrderDetailsProps) {
  const { id } = use(params);
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkOrderDetails();
  }, [id]);

  const fetchWorkOrderDetails = async () => {
    try {
      setLoading(true);
      const woData = await workOrderService.getWorkOrderById(id);
      setWorkOrder(woData);

      const sampleData = await sampleService.getSamplesByWorkOrderId(id);
      setSamples(sampleData);
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
          Loading work order details...
        </div>
      </Layout>
    );
  }

  if (!workOrder) {
    return (
      <Layout>
        <div className="p-6 text-center text-red-500 font-semibold">
          Work Order not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Back and Title */}
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/work-order/list" className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white border">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Work Order Details</span>
            <h2 className="text-2xl font-bold text-gray-800">{workOrder.workOrderNumber}</h2>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Attributes */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Submission Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Customer</p>
                    <p className="text-sm font-semibold text-gray-800">{workOrder.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Project / Site Name</p>
                    <p className="text-sm font-semibold text-gray-800">{workOrder.projectName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Received Date</p>
                    <p className="text-sm font-semibold text-gray-800">{workOrder.receivedDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Due Date</p>
                    <p className="text-sm font-semibold text-gray-800">{workOrder.dueDate || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Remarks / Instructions</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg italic">
                {workOrder.remarks || 'No special remarks recorded.'}
              </p>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Properties</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-500">Requested By</span>
                  <span className="text-sm font-semibold text-gray-800">{workOrder.requestedByName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-500">Priority</span>
                  <PriorityBadge priority={workOrder.priority || 'Medium'} />
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-500">Status</span>
                  <StatusBadge status={workOrder.status || 'OPEN'} />
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">Samples Count</span>
                  <span className="text-sm font-bold text-blue-600">{samples.length} Samples</span>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <Link
                href={`/sample/add?workOrderId=${workOrder.id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Sample</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Associated Samples Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Beaker className="w-5 h-5 text-gray-400" />
              <span>Registered Samples</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Sample ID</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Material Type</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Collection Date</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Workflow Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {samples.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500 text-sm">
                      No Samples registered under this Work Order.
                    </td>
                  </tr>
                ) : (
                  samples.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                        <Link href={`/sample/${s.id}`} className="hover:underline">
                          {s.sampleId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{s.materialName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.quantity} {s.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <PriorityBadge priority={s.priority || 'Normal'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.collectionDate || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={s.status || 'REGISTERED'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                        <Link href={`/sample/${s.id}`} className="text-blue-600 hover:text-blue-900">
                          View details
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
