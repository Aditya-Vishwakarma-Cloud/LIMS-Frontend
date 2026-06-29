"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, Plus, Edit2, Trash2, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { workOrderService, WorkOrder } from '@/services/workOrderService';
import { useRouter } from 'next/navigation';
import ConfirmationDialog from '@/app/components/shared/ConfirmationDialog';
import StatusBadge from '@/app/components/shared/StatusBadge';
import PriorityBadge from '@/app/components/shared/PriorityBadge';
import Link from 'next/link';

export default function WorkOrderList() {
  const router = useRouter();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const data = await workOrderService.getAllWorkOrders();
      setWorkOrders(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch work orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await workOrderService.deleteWorkOrder(deleteId);
      setDeleteId(null);
      fetchWorkOrders();
    } catch (err: any) {
      console.error(err);
      setError('Failed to delete work order.');
      setDeleteId(null);
    }
  };

  const filteredWorkOrders = workOrders.filter(wo =>
    wo.workOrderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.priority?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Work Orders</h2>
            <p className="text-sm text-gray-500 mt-1">Manage and track client testing requests in the lab.</p>
          </div>
          <Link href="/work-order/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold flex items-center space-x-2 transition-all duration-300 shadow-sm self-start">
            <Plus className="w-4 h-4" />
            <span>New Work Order</span>
          </Link>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by WO Number, Customer, Project or Priority..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Table list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">WO Number</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Customer</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Project Name</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Received Date</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Due Date</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Priority</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Status</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                      Loading work orders...
                    </td>
                  </tr>
                ) : filteredWorkOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500">
                      No work orders registered.
                    </td>
                  </tr>
                ) : (
                  filteredWorkOrders.map(wo => (
                    <tr key={wo.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600 border-r border-gray-200">
                        <Link href={`/work-order/${wo.id}`} className="hover:underline">
                          {wo.workOrderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">{wo.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200 font-semibold">{wo.projectName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{wo.receivedDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{wo.dueDate || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm border-r border-gray-200">
                        <PriorityBadge priority={wo.priority || 'Normal'} />
                      </td>
                      <td className="px-6 py-4 text-sm border-r border-gray-200">
                        <StatusBadge status={wo.status || 'OPEN'} />
                      </td>
                      <td className="px-6 py-4 text-sm text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/work-order/${wo.id}`)}
                          className="text-gray-600 hover:text-gray-900 font-semibold inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => router.push(`/work-order/edit/${wo.id}`)}
                          className="text-blue-600 hover:text-blue-900 font-semibold inline-flex items-center space-x-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteId(wo.id || null)}
                          className="text-rose-600 hover:text-rose-900 font-semibold inline-flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ConfirmationDialog
          isOpen={!!deleteId}
          title="Delete Work Order"
          message="Are you sure you want to delete this work order? This will soft delete and preserve data integrity."
          confirmText="Delete"
          type="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </Layout>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
