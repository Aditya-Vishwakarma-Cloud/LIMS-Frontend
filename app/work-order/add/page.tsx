"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { workOrderService } from '@/services/workOrderService';
import { customerService, ContactPerson } from '@/services/customerService';
import CustomerSelector from '@/app/components/shared/CustomerSelector';
import ProjectSelector from '@/app/components/shared/ProjectSelector';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AddWorkOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const queryCustomerId = searchParams.get('customerId') || '';
  const queryProjectId = searchParams.get('projectId') || '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    customerId: queryCustomerId,
    projectId: queryProjectId,
    receivedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    priority: 'Medium',
    requestedById: '',
    remarks: '',
    status: 'OPEN'
  });

  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    if (formData.customerId) {
      loadCustomerContacts(formData.customerId);
    } else {
      setContacts([]);
    }
  }, [formData.customerId]);

  const loadCustomerContacts = async (customerId: string) => {
    try {
      setLoadingContacts(true);
      const customer = await customerService.getCustomerById(customerId);
      setContacts(customer.contactPersons || []);
      // Pre-select primary contact if available
      if (customer.primaryContactId) {
        setFormData(prev => ({ ...prev, requestedById: customer.primaryContactId || '' }));
      }
    } catch (err) {
      console.error('Failed to load contacts for customer', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.projectId || !formData.receivedDate) {
      setError('Customer, Project and Received Date are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await workOrderService.createWorkOrder(formData);
      router.push('/work-order/list');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create work order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/work-order/list" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">New Work Order</h2>
              <p className="text-sm text-gray-500 mt-1">Register a new sample submission test request from a customer.</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Customer Selector */}
              <CustomerSelector
                value={formData.customerId}
                onChange={(val) => setFormData({ ...formData, customerId: val, projectId: '', requestedById: '' })}
                required
              />

              {/* Project Selector */}
              <ProjectSelector
                customerId={formData.customerId}
                value={formData.projectId}
                onChange={(val) => setFormData({ ...formData, projectId: val })}
                required
              />

              {/* Received Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Received Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.receivedDate}
                  onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* Requested By (Contact Persons) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Requested By
                </label>
                <select
                  value={formData.requestedById}
                  onChange={(e) => setFormData({ ...formData, requestedById: e.target.value })}
                  disabled={!formData.customerId || loadingContacts}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 disabled:bg-gray-100"
                >
                  <option value="">{formData.customerId ? 'Select Contact Person' : 'Select Customer First'}</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.designation ? `(${c.designation})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {/* Remarks */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Remarks / Special Instructions
                </label>
                <textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Notes about the work order..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>

            </div>

            <div className="pt-4 border-t flex justify-end space-x-3">
              <Link
                href="/work-order/list"
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold shadow-sm flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Work Order</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
